const get = require('lodash/get')
const _ensureLoggedIn = require('connect-ensure-login')
const getTime = require('date-fns/get_time')
const encodeHMACSHA256 = require('crypto-js/hmac-sha256')
const { merge, toQs } = require('@nudj/library')
const serialize = require('serialize-javascript')

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
      _ensureLoggedIn.ensureLoggedIn({
        setReturnTo: !req.session.returnTo,
        redirectTo: `/login?${toQs(req.query)}`
      })(
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

  async function fetchUser (userId) {
    if (!userId) return null

    const gql = `
      query fetchUser {
        user {
          email
          firstName
          lastName
        }
      }
    `

    const { user } = await request(userId, gql)
    return user
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
      let pageData = {}
      try {
        if (typeof gql === 'string') pageData = await request(req.session.userId, gql, variables)
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
            pageData = await catcher(error)
            return render(req, res, next, pageData)
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

  async function respond (req, res, next, renderData) {
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
      const user = await fetchUser(req.session.userId)
      let status = get(
        renderData,
        'app.error.code',
        staticContext.status || 200
      )
      let intercomUserToken = null
      let email = null
      let fullname = null

      if (user && user.email) {
        // Similar to intercom.createUser (creates a user if they do not exist)
        intercomUserToken = encodeHMACSHA256(user.email, process.env.INTERCOM_SECRET_KEY)
        email = user.email
      }

      if (user && user.firstName && user.lastName) {
        fullname = `${user.firstName} ${user.lastName}`
      }

      res.status(status).render('app', {
        data: serialize(renderData, { isJSON: true }),
        renderedClassNames: serialize(staticContext.css.renderedClassNames, { isJSON: true }),
        cssContent: staticContext.css.content,
        html: staticContext.html,
        helmet: staticContext.helmet,
        cookiesAccepted: req.cookies.cookiesEnabled !== 'false',
        intercom_data: serialize({
          app_id: process.env.INTERCOM_APP_ID,
          user_token: intercomUserToken && `${intercomUserToken}`,
          email: email,
          fullname,
          created_at: user && user.created ? getTime(user.created) / 1000 : null
        }, { isJSON: true }),
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
