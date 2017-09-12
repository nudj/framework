const get = require('lodash/get')
const find = require('lodash/find')
const _ensureLoggedIn = require('connect-ensure-login')
const getTime = require('date-fns/get_time')
const { merge } = require('@nudj/library')

const logger = require('../../lib/logger')
const app = require('../../redux/server')

const getMiddleware = ({
  App,
  reduxRoutes,
  reduxReducers,
  mockData,
  spoofLoggedIn,
  errorHandlers
}) => {
  function doEnsureLoggedIn (req, res, next) {
    if (req.session.logout) {
      let url = req.originalUrl.split('/')
      url.pop()
      res.redirect(url.join('/'))
    } else {
      if (req.xhr) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
          return res.status(401).send()
        }
      }
      _ensureLoggedIn.ensureLoggedIn({ setReturnTo: !req.session.returnTo })(req, res, next)
    }
    delete req.session.logout
  }

  const spoofUser = process.env.SPOOF_USER === 'true'
  const ensureLoggedIn = spoofUser ? spoofLoggedIn : doEnsureLoggedIn

  function getRenderDataBuilder (req) {
    return (data) => {
      data.csrfToken = req.csrfToken()
      if (req.session.data) {
        req.session.data.person = data.person || req.session.data.person
        data.person = req.session.data.person
      }
      if (req.session.notification) {
        data.notification = req.session.notification
        delete req.session.notification
      }
      data.url = {
        protocol: req.protocol,
        hostname: req.hostname,
        originalUrl: req.originalUrl
      }
      data.web = {
        protocol: req.protocol,
        hostname: process.env.WEB_HOSTNAME
      }
      return {
        app: data
      }
    }
  }

  const frameworkErrorHandlers = {
    'Invalid url': () => ({
      message: {
        code: 400,
        error: 'error',
        message: 'Form submission data invalid'
      }
    }),
    'Not found': () => ({
      error: {
        code: 404,
        type: 'error',
        message: 'Not found'
      }
    }),
    'Error': () => ({
      error: {
        code: 500,
        type: 'error',
        message: 'Something went wrong'
      }
    })
  }
  const allErrorHandlers = merge(frameworkErrorHandlers, errorHandlers)

  function getErrorHandler (req, res, next) {
    return (error) => {
      try {
        logger.log('error', error.message, error)

        let data
        if (allErrorHandlers[error.message]) {
          data = allErrorHandlers[error.message](res, res, next, error)
        } else {
          data = allErrorHandlers.Error()
        }

        // check for data as handler may have redirected
        if (data) {
          data = getRenderDataBuilder(req)(data)
          getRenderer(req, res, next)(data)
        }
      } catch (error) {
        logger.log('error', error)
        next(error)
      }
    }
  }

  function getRenderer (req, res, next) {
    return (data) => {
      delete req.session.logout
      delete req.session.returnTo
      if (req.xhr) {
        return res.json(data)
      }
      let staticContext = app({
        App,
        reduxRoutes,
        reduxReducers,
        data
      })
      if (staticContext.url) {
        res.redirect(staticContext.url)
      } else {
        let status = get(data, 'server.error.code', staticContext.status || 200)
        let person = get(data, 'server.person')
        res.status(status).render('app', {
          data: JSON.stringify(data),
          css: staticContext.css,
          html: staticContext.html,
          helmet: staticContext.helmet,
          intercom_app_id: `'${process.env.INTERCOM_APP_ID}'`,
          fullname: person && person.firstName && person.lastName && `'${person.firstName} ${person.lastName}'`,
          email: person && `'${person.email}'`,
          created_at: person && (getTime(person.created) / 1000)
        })
      }
    }
  }

  function respondWith (dataFetcher) {
    return (req, res, next) => {
      return dataFetcher({
        data: merge(req.session.data || {}),
        params: req.params,
        body: req.body,
        req
      })
      .then(getRenderDataBuilder(req, res, next))
      .then(getRenderer(req, res, next))
      .catch(error => next(error))
    }
  }

  function render (req, res, next, data) {
    data = getRenderDataBuilder(req, res, next)(data)
    getRenderer(req, res, next)(data)
  }

  return {
    ensureLoggedIn,
    respondWith,
    render
  }
}

module.exports = getMiddleware
