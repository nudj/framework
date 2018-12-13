const get = require('lodash/get')
const _ensureLoggedIn = require('connect-ensure-login')
const { merge, toQs } = require('@nudj/library')
const serialize = require('serialize-javascript')

const requestGQL = require('../../lib/requestGQL')
const app = require('../../redux/server')
const { removeAjaxPostfix } = require('../../lib')
const { AJAX_POSTFIX } = require('../../lib/constants')

const getMiddleware = ({
  App,
  getAnalytics = () => {},
  reduxRoutes,
  reduxReducers,
  spoofLoggedIn,
  errorHandlers,
  gqlFragments
}) => {
  function ensureAuthorised (redirectPathOverride) {
    return (req, res, next) => {
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
          redirectTo: `/${redirectPathOverride || 'auth'}?${toQs(req.query)}`
        })(
          req,
          res,
          next
        )
      }
      delete req.session.logout
    }
  }
  const ensureLoggedIn = ensureAuthorised('login')

  function respondWith (fetcher = () => ({})) {
    return async (req, res, next) => {
      const analytics = await getAnalytics(req)

      try {
        const pageData = await fetcher({
          data: {},
          params: req.params,
          body: req.body,
          files: req.files,
          query: req.query,
          session: req.session,
          analytics
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
      const requestGQLWithUser = ({ gql, variables }) => requestGQL(req.session.userId, gql, variables)
      const analytics = await getAnalytics(req)

      // fetch page data based on given gql query
      const { gql, variables, respond, transformData, catcher } = await gqlQueryComposer({
        params: req.params,
        body: req.body,
        files: req.files,
        query: req.query,
        session: req.session,
        requestGQL: requestGQLWithUser,
        analytics,
        req,
        res
      })
      let pageData = {}
      try {
        if (typeof gql === 'string') pageData = await requestGQLWithUser({ gql, variables })
        if (typeof transformData === 'function') {
          pageData = await transformData(pageData)
        }
        if (typeof respond === 'function') return await respond(pageData)

        render(req, res, next, pageData)
      } catch (error) {
        if (error.constructor.name === 'Redirect') return next(error)
        console.error('respondWithGql', error)

        if (typeof catcher === 'function') {
          try {
            pageData = await catcher(error)
            return render(req, res, next, pageData)
          } catch (error) {
            console.error('catcher', error)
            return next(error)
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
      let status = get(
        renderData,
        'app.error.code',
        staticContext.status || 200
      )

      res.status(status).render('app', {
        data: serialize(renderData, { isJSON: true }),
        sessionUser: serialize({ id: req.session.userId }, { isJSON: true }),
        renderedClassNames: serialize(staticContext.css.renderedClassNames, { isJSON: true }),
        cssContent: staticContext.css.content,
        html: staticContext.html,
        helmet: staticContext.helmet,
        env: process.env.NODE_ENV,
        build_asset_path: process.env.USE_DEV_SERVER ? `${process.env.DEV_SERVER_PATH}` : ''
      })
    }
  }

  return {
    ensureLoggedIn,
    ensureAuthorised,
    respondWith,
    respondWithGql,
    render
  }
}

module.exports = getMiddleware
