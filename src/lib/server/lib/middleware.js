const get = require('lodash/get')
const find = require('lodash/find')
const _ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const getTime = require('date-fns/get_time')
const { merge } = require('@nudj/library')

const logger = require('../../lib/logger')
const app = require('../../redux/server')

const getMiddleware = ({
  reduxRoutes,
  reduxReducers,
  mockData
}) => {
  function spoofLoggedIn (req, res, next) {
    req.session.data = req.session.data || {
      hirer: find(mockData.hirers, { id: 'hirer1' }),
      person: find(mockData.people, { id: 'person5' })
    }
    return next()
  }

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
      _ensureLoggedIn(req, res, next)
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

  function getErrorHandler (req, res, next) {
    return (error) => {
      try {
        let data, errorMessage
        switch (error.message) {
          // renders with message
          case 'Invalid url':
            errorMessage = {
              code: 400,
              error: 'error',
              message: 'Form submission data invalid'
            }
            data = getRenderDataBuilder(req)({
              message: errorMessage
            })
            getRenderer(req, res, next)(data)
            break
          // full page errors
          default:
            logger.log('error', error.message, error)
            switch (error.message) {
              case 'Not found':
                errorMessage = {
                  code: 404,
                  type: 'error',
                  message: 'Not found'
                }
                break
              default:
                errorMessage = {
                  code: 500,
                  type: 'error',
                  message: 'Something went wrong'
                }
            }
            data = getRenderDataBuilder(req)({
              error: errorMessage
            })
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
        data: merge(req.session.data),
        params: req.params,
        body: req.body,
        req
      })
      .then(getRenderDataBuilder(req, res, next))
      .then(getRenderer(req, res, next))
      .catch(getErrorHandler(req, res, next))
    }
  }

  return {
    ensureLoggedIn,
    respondWith
  }
}

module.exports = getMiddleware
