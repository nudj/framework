const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const cons = require('consolidate')
const session = require('express-session')
const favicon = require('serve-favicon')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const csrf = require('csurf')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)
const { merge, cookies } = require('@nudj/library')

const logger = require('../lib/logger')
const getMiddleware = require('./lib/middleware')
const { isAjax, addAjaxPostfix } = require('../lib')

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error)
})

module.exports = ({
  App,
  reduxRoutes,
  reduxReducers,
  expressRouters,
  expressAssetPath,
  buildAssetPath,
  spoofLoggedIn,
  errorHandlers,
  gqlFragments
}) => {
  let strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: `${process.env.PROTOCOL_DOMAIN}/callback`
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile)
    }
  )
  passport.use(strategy)
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))

  const app = express()
  app.set('trust proxy', 1)
  const sessionOpts = {
    secret: process.env.SESSION_SECRET,
    name: cookies.getSecureName('session'),
    resave: false, // should not need this as redis store implements touch
    saveUninitialized: false, // as we dont want to track users (anon or otherwise) unless they login
    cookie: {
      secure: true, // true to only allow over HTTPS
      httpOnly: true, // true so we do not expose to client side JS
      sameSite: false // false as login flow breaks on web otherwise
    }
  }
  const dynamicAssetOptions = {
    index: false
  }
  const cachedAssetOptions = {
    index: false,
    setHeaders: (res, path) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000')
    }
  }
  const middlewareOptions = {
    App,
    reduxRoutes,
    reduxReducers,
    spoofLoggedIn,
    errorHandlers,
    gqlFragments
  }
  const middleware = getMiddleware(middlewareOptions)
  const Redirect = (req, res, next, options) => {
    if (options.notification) {
      req.session.notification = options.notification
    }
    let redirectUrl = options.url
    if (isAjax(req.originalUrl)) {
      redirectUrl = addAjaxPostfix(redirectUrl)
    }
    logger.log(
      'info',
      `Redirect - From: ${req.originalUrl}, To: ${redirectUrl}`,
      ...options.log
    )
    res.redirect(303, redirectUrl)
  }
  const NotFound = (req, res, next, options) => {
    logger.log('warn', `NotFound - ${req.originalUrl}`, ...options.log)
    return {
      error: {
        code: 404,
        type: 'error',
        message: 'Not found'
      }
    }
  }
  const Unauthorized = (req, res, next, options) => {
    logger.log('warn', `Unauthorized - ${options.type}`, ...options.log)
    res.status(401).send(options.type)
  }
  const AppError = (req, res, next, options) => {
    logger.log('error', 'AppError', ...options.log, options.stack)
    return {
      error: {
        code: 500,
        type: 'error',
        message: 'Something went wrong'
      }
    }
  }
  const GenericError = (req, res, next, error) => {
    logger.log('error', 'GenericError', error.name, error.message, error.stack)
    return {
      error: {
        code: 500,
        type: 'error',
        message: 'Something went wrong'
      }
    }
  }
  const allErrorHandlers = merge(
    {
      Redirect,
      NotFound,
      Unauthorized,
      AppError,
      GenericError
    },
    errorHandlers
  )

  if (process.env.REDIS_SESSION === 'true') {
    // add redis persistence to session
    sessionOpts.store = new RedisStore({
      client: redis.createClient(6379, 'redis')
    })
  }

  app.engine('html', cons.lodash)
  app.set('view engine', 'html')
  app.set('views', path.join(__dirname, 'views'))

  app.use(cookieParser())
  app.use(favicon(path.join(__dirname, 'assets/images/nudj-square.ico')))
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json({ limit: '5mb' }))

  if (buildAssetPath) {
    app.use('/build', express.static(buildAssetPath, dynamicAssetOptions))
  }

  app.use('/assets', express.static(expressAssetPath, cachedAssetOptions))
  app.use(
    '/assets',
    express.static(path.join(__dirname, 'assets'), cachedAssetOptions)
  )
  app.use(session(sessionOpts))
  app.use(passport.initialize())
  app.use(passport.session())

  // add insecure expressRouters
  expressRouters.insecure.forEach(router => {
    app.use(router(middleware))
  })

  app.use(fileUpload())
  app.use(csrf({}))
  app.use((req, res, next) => {
    if (req.body && req.body._csrf) {
      delete req.body._csrf
    }
    if (req.params && req.params._csrf) {
      delete req.params._csrf
    }
    next()
  })

  // add secure expressRouters
  expressRouters.secure.forEach(router => {
    app.use(router(middleware))
  })

  app.use((req, res) => {
    logger.log('warn', 'Page not found', req.url)
    res.status(404)
    if (req.accepts('html')) {
      res.render('404', { url: req.url })
      return
    }
    if (req.accepts('json')) {
      res.send({ error: '404: Page not found' })
      return
    }
    res.type('txt').send('404: Page not found')
  })

  app.use((error, req, res, next) => {
    try {
      let handler
      if (allErrorHandlers[error.name]) {
        handler = error.name
      } else {
        handler = 'GenericError'
      }
      const data = allErrorHandlers[handler](req, res, next, error)
      if (data) {
        middleware.render(req, res, next, data)
      }
    } catch (error) {
      logger.log('error', 'COMPLETE AND UTTER FAILURE', error)
      res.status(500)
      if (req.accepts('html')) {
        res.render('500', { url: req.url })
        return
      }
      if (req.accepts('json')) {
        res.send({ error: '500: Internal server error' })
        return
      }
      res.type('txt').send('500: Internal server error')
    }
  })

  return app
}
