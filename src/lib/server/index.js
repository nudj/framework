const path = require('path')
console.log(91)
const express = require('express')
console.log(92)
const bodyParser = require('body-parser')
console.log(93)
const cookieParser = require('cookie-parser')
console.log(94)
const fileUpload = require('express-fileupload')
console.log(95)
const cons = require('consolidate')
console.log(96)
const session = require('express-session')
console.log(97)
const favicon = require('serve-favicon')
console.log(98)
const passport = require('passport')
console.log(99)
const Auth0Strategy = require('@nudj/passport-auth0')
console.log(910)
const csrf = require('csurf')
console.log(911)
const redis = require('redis')
console.log(912)
const RedisStore = require('connect-redis')(session)
console.log(913)
const helmet = require('helmet')
console.log(914)
const { merge, cookies } = require('@nudj/library')
console.log(915)

console.log(916)
const logger = require('../lib/logger')
console.log(917)
const getMiddleware = require('./lib/middleware')
console.log(918)
const { isAjax, addAjaxPostfix } = require('../lib')
console.log(919)

console.log(920)
process.on('unhandledRejection', error => {
  console.log(921)
  // Will print "unhandledRejection err is not defined"
  console.log(922)
  console.log('unhandledRejection', error)
  console.log(923)
})
console.log(924)

console.log(925)
module.exports = ({
  App,
  reduxRoutes,
  reduxReducers,
  expressRouters,
  expressAssetPath,
  buildAssetPath,
  spoofLoggedIn,
  errorHandlers,
  gqlFragments,
  helmetConfig
}) => {
  console.log(926)
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
      console.log(927)
      return done(null, profile)
    }
  )
  console.log(929)
  passport.use(strategy)
  console.log(930)
  passport.serializeUser((user, done) => done(null, user))
  console.log(931)
  passport.deserializeUser((user, done) => done(null, user))
  console.log(932)

  const app = express()
  console.log(933)
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
  console.log(934)
  const dynamicAssetOptions = {
    index: false
  }
  console.log(935)
  const cachedAssetOptions = {
    index: false,
    setHeaders: (res, path) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000')
    }
  }
  console.log(936)
  const middlewareOptions = {
    App,
    reduxRoutes,
    reduxReducers,
    spoofLoggedIn,
    errorHandlers,
    gqlFragments
  }
  console.log(937)
  const middleware = getMiddleware(middlewareOptions)
  console.log(938)
  const Redirect = (req, res, next, options) => {
    console.log(939)
    if (options.notification) {
      console.log(940)
      req.session.notification = options.notification
      console.log(941)
    }
    console.log(942)
    let redirectUrl = options.url
    console.log(943)
    if (isAjax(req.originalUrl)) {
      console.log(944)
      redirectUrl = addAjaxPostfix(redirectUrl)
      console.log(945)
    }
    console.log(946)
    logger.log(
      'info',
      `Redirect - From: ${req.originalUrl}, To: ${redirectUrl}`,
      ...options.log
    )
    console.log(947)
    res.redirect(303, redirectUrl)
    console.log(948)
  }
  console.log(949)
  const NotFound = (req, res, next, options) => {
    console.log(950)
    logger.log('warn', `NotFound - ${req.originalUrl}`, ...options.log)
    console.log(951)
    return {
      error: {
        code: 404,
        type: 'error',
        message: 'Not found'
      }
    }
  }
  console.log(952)
  const Unauthorized = (req, res, next, options) => {
    console.log(953)
    logger.log('warn', `Unauthorized - ${options.type}`, ...options.log)
    console.log(954)
    res.status(401).send(options.type)
    console.log(955)
  }
  console.log(956)
  const AppError = (req, res, next, options) => {
    console.log(957)
    logger.log('error', 'AppError', ...options.log, options.stack)
    console.log(958)
    return {
      error: {
        code: 500,
        type: 'error',
        message: 'Something went wrong'
      }
    }
  }
  console.log(959)
  const GenericError = (req, res, next, error) => {
    console.log(960)
    logger.log('error', 'GenericError', error.name, error.message, error.stack)
    console.log(961)
    return {
      error: {
        code: 500,
        type: 'error',
        message: 'Something went wrong'
      }
    }
  }
  console.log(962)
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
  console.log(963)

  if (process.env.REDIS_SESSION === 'true') {
    console.log(964)
    // add redis persistence to session
    sessionOpts.store = new RedisStore({
      client: redis.createClient(6379, 'redis')
    })
    console.log(965)
  }
  console.log(966)

  app.engine('html', cons.lodash)
  console.log(967)
  app.set('trust proxy', 1)
  console.log(968)
  app.set('view engine', 'html')
  console.log(969)
  app.set('views', path.join(__dirname, 'views'))
  console.log(970)

  app.use(helmet(merge({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'"
        ]
      }
    },
    noCache: true
  }, helmetConfig || {})))
  console.log(971)
  app.use(cookieParser())
  console.log(972)
  app.use(favicon(path.join(__dirname, 'assets/images/nudj-square.ico')))
  console.log(973)
  app.use(bodyParser.urlencoded({ extended: false }))
  console.log(974)
  app.use(bodyParser.json({ limit: '5mb' }))
  console.log(975)

  if (buildAssetPath) {
    console.log(976)
    app.use('/build', express.static(buildAssetPath, dynamicAssetOptions))
    console.log(977)
  }
  console.log(978)

  app.use('/assets', express.static(expressAssetPath, cachedAssetOptions))
  console.log(979)
  app.use(
    '/assets',
    express.static(path.join(__dirname, 'assets'), cachedAssetOptions)
  )
  console.log(980)
  app.use(session(sessionOpts))
  console.log(981)
  app.use(passport.initialize())
  console.log(982)
  app.use(passport.session())
  console.log(983)

  // add insecure expressRouters
  expressRouters.insecure.forEach(router => {
    console.log(984)
    app.use(router(middleware))
    console.log(985)
  })
  console.log(986)

  app.use(fileUpload())
  console.log(987)
  app.use(csrf({}))
  console.log(988)
  app.use((req, res, next) => {
    console.log(989)
    if (req.body && req.body._csrf) {
      console.log(990)
      delete req.body._csrf
      console.log(991)
    }
    console.log(992)
    if (req.params && req.params._csrf) {
      console.log(993)
      delete req.params._csrf
      console.log(994)
    }
    console.log(995)
    next()
    console.log(996)
  })
  console.log(997)

  // add secure expressRouters
  expressRouters.secure.forEach(router => {
    console.log(998)
    app.use(router(middleware))
    console.log(999)
  })
  console.log(9100)

  app.use((req, res) => {
    console.log(9101)
    logger.log('warn', 'Page not found', req.url)
    console.log(9102)
    res.status(404)
    console.log(9103)
    if (req.accepts('html')) {
      console.log(9104)
      res.render('404', { url: req.url })
      console.log(9105)
      return
    }
    console.log(9106)
    if (req.accepts('json')) {
      console.log(9107)
      res.send({ error: '404: Page not found' })
      console.log(9108)
      return
    }
    console.log(9109)
    res.type('txt').send('404: Page not found')
    console.log(9110)
  })
  console.log(9111)

  app.use((error, req, res, next) => {
    console.log(9112)
    try {
      console.log(9113)
      let handler
      console.log(9114)
      if (allErrorHandlers[error.name]) {
        console.log(9115)
        handler = error.name
        console.log(9116)
      } else {
        console.log(9117)
        handler = 'GenericError'
        console.log(9118)
      }
      console.log(9119)
      const data = allErrorHandlers[handler](req, res, next, error)
      console.log(9120)
      if (data) {
        console.log(9121)
        middleware.render(req, res, next, data)
        console.log(9122)
      }
      console.log(9123)
    } catch (error) {
      console.log(9124)
      logger.log('error', 'COMPLETE AND UTTER FAILURE', error)
      console.log(9125)
      res.status(500)
      console.log(9126)
      if (req.accepts('html')) {
        console.log(9127)
        res.render('500', { url: req.url })
        console.log(9128)
        return
      }
      console.log(9129)
      if (req.accepts('json')) {
        console.log(9130)
        res.send({ error: '500: Internal server error' })
        console.log(9131)
        return
      }
      console.log(9132)
      res.type('txt').send('500: Internal server error')
      console.log(9133)
    }
    console.log(9134)
  })
  console.log(9135)

  console.log(9136)
  return app
}
console.log(9137)
