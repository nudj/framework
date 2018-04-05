const get = require('lodash/get')
const _ensureLoggedIn = require('connect-ensure-login')
const getTime = require('date-fns/get_time')
const { merge } = require('@nudj/library')

const request = require('../../lib/requestGQL')
const app = require('../../redux/server')
const { removeAjaxPostfix } = require('../../lib')
const { AJAX_POSTFIX } = require('../../lib/constants')

const getMiddleware = ({
  App,
  reduxRoutes,
  reduxReducers,
  spoofLoggedIn,
  errorHandlers,
  gqlFragments
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
      _ensureLoggedIn.ensureLoggedIn({ setReturnTo: !req.session.returnTo })(
        req,
        res,
        next
      )
    }
    delete req.session.logout
  }

  const spoofUser = process.env.SPOOF_USER === 'true'
  const ensureLoggedIn = spoofUser ? spoofLoggedIn : doEnsureLoggedIn

  function respondWith (fetcher = () => ({})) {
    return async (req, res, next) => {
      try {
        const pageData = await fetcher({
          data: {},
          params: req.params,
          body: req.body,
          files: req.files,
          query: req.query,
          session: req.session
        })
        render(req, res, next, pageData)
      } catch (error) {
        console.error(error)
        next(error)
      }
    }
  }

  function respondWithGql (gqlQueryComposer = () => ({})) {
    return async (req, res, next) => {
      // fetch page data based on given gql query
      const { gql, variables, respond, transformData, catcher } = gqlQueryComposer({
        params: req.params,
        body: req.body,
        files: req.files,
        query: req.query,
        session: req.session,
        req,
        res
      })
      try {
        let pageData = {}
        if (typeof gql === 'string') pageData = await request(gql, variables)
        if (typeof transformData === 'function') {
          pageData = await transformData(pageData)
        }
        if (typeof respond === 'function') return await respond(pageData)

        render(req, res, next, pageData)
      } catch (error) {
        if (error.constructor.name === 'Redirect') return next(error)
        console.error(error)

        if (typeof catcher === 'function') {
          try {
            return catcher(error)
          } catch (error) {
            console.error(error)
            next(error)
          }
        }
        next(error)
      }
    }
  }

  function render (req, res, next, renderData) {
    renderData = merge(renderData, {
      csrfToken: req.csrfToken && req.csrfToken(),
      url: {
        protocol: req.protocol,
        hostname: req.hostname,
        originalUrl: removeAjaxPostfix(req.originalUrl),
        path: removeAjaxPostfix(req.path),
        query: req.query
      },
      web: {
        protocol: req.protocol,
        hostname: process.env.WEB_HOSTNAME
      }
    })
    if (req.session.notification) {
      renderData.notification = req.session.notification
      delete req.session.notification
    }
    respond(req, res, next, renderData)
  }

  function respond (req, res, next, renderData) {
    delete req.session.logout
    delete req.session.returnTo

    renderData = { app: renderData }

    // if ajax request (url ends with `/json`) respond with json
    if (req.path.endsWith(AJAX_POSTFIX)) {
      return res.json(renderData)
    }

    // otherwise respond with React rendered html
    let staticContext = app({
      App,
      reduxRoutes,
      reduxReducers,
      data: renderData
    })
    if (staticContext.url) {
      res.redirect(staticContext.url)
    } else {
      let status = get(
        renderData,
        'app.error.code',
        staticContext.status || 200
      )
      let person = get(renderData, 'app.person')
      res.status(status).render('app', {
        data: JSON.stringify(renderData),
        css: staticContext.css,
        html: staticContext.html,
        helmet: staticContext.helmet,
        intercom_app_id: `'${process.env.INTERCOM_APP_ID}'`,
        fullname:
          person &&
          person.firstName &&
          person.lastName &&
          `'${person.firstName} ${person.lastName}'`,
        email: person && `'${person.email}'`,
        created_at: person && getTime(person.created) / 1000,
        env: process.env.NODE_ENV,
        build_asset_path: process.env.USE_DEV_SERVER ? `${process.env.DEV_SERVER_PATH}` : ''
      })
    }
  }

  return {
    ensureLoggedIn,
    respondWith,
    respondWithGql,
    render
  }
}

module.exports = getMiddleware
