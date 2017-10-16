const get = require('lodash/get')
const _ensureLoggedIn = require('connect-ensure-login')
const getTime = require('date-fns/get_time')
const { merge } = require('@nudj/library')

const app = require('../../redux/server')
const { removeAjaxPostfix } = require('../../lib')
const { AJAX_POSTFIX } = require('../../lib/constants')

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

  function initialData (req, data = {}) {
    data = merge(data, req.session.data || {}, {
      csrfToken: req.csrfToken(),
      url: {
        protocol: req.protocol,
        hostname: req.hostname,
        originalUrl: removeAjaxPostfix(req.originalUrl)
      },
      web: {
        protocol: req.protocol,
        hostname: process.env.WEB_HOSTNAME
      }
    })
    if (req.session.notification) {
      data.notification = req.session.notification
      delete req.session.notification
    }
    return data
  }

  function getRenderer (req, res, next) {
    return (data) => {
      delete req.session.logout
      delete req.session.returnTo
      data = { app: data }
      if (req.path.endsWith(AJAX_POSTFIX)) {
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
        let status = get(data, 'app.error.code', staticContext.status || 200)
        let person = get(data, 'app.person')
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
      dataFetcher = dataFetcher || (() => Promise.resolve(initialData(req)))
      return dataFetcher({
        data: initialData(req),
        params: req.params,
        body: req.body,
        query: req.query,
        req
      })
      .then(getRenderer(req, res, next))
      .catch(next)
    }
  }

  function render (req, res, next, data) {
    data = initialData(req, data)
    getRenderer(req, res, next)(data)
  }

  return {
    ensureLoggedIn,
    respondWith,
    render
  }
}

module.exports = getMiddleware
