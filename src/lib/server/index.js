const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cons = require('consolidate')
const session = require('express-session')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const csrf = require('csurf')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)

const logger = require('../lib/logger')
const getMiddleware = require('./lib/middleware')

module.exports = ({
  reduxRoutes,
  reduxReducers,
  expressRouters,
  expressAssetPath,
  mockData
}) => {
  let strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: '/callback'
  }, (accessToken, refreshToken, extraParams, profile, done) => {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile)
  })
  passport.use(strategy)
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))

  const app = express()
  const sessionOpts = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  }
  const customAssetOptions = {
    index: false
  }
  const frameworkAssetOptions = {
    index: false,
    setHeaders: (res, path) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000')
    }
  }
  const middlewareOptions = {
    reduxRoutes,
    reduxReducers,
    mockData
  }

  if (process.env.NODE_ENV === 'production') {
    // add redis persistence to session
    sessionOpts.store = new RedisStore({
      client: redis.createClient(6379, 'redis')
    })
  }
  if (process.env.USE_MOCKS === 'true') {
    // start mock api
    let mockApi = require('../mocks')({ mockData })
    mockApi.listen(81, () => logger.log('info', 'Mock API running'))
  }

  app.engine('html', cons.lodash)
  app.set('view engine', 'html')
  app.set('views', path.join(__dirname, 'views'))

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use('/assets', express.static(expressAssetPath, customAssetOptions))
  app.use('/assets', express.static(path.join(__dirname, 'assets'), frameworkAssetOptions))
  app.use(session(sessionOpts))
  app.use(passport.initialize())
  app.use(passport.session())
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

  // add expressRouters
  expressRouters.forEach(router => {
    const middleware = getMiddleware(middlewareOptions)
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
    logger.log('error', 'Application error', error)
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
  })

  app.listen(80, () => logger.log('info', 'App running'))
}
