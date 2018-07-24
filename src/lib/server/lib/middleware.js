const get = require('lodash/get')
console.log(81)
const _ensureLoggedIn = require('connect-ensure-login')
console.log(82)
const getTime = require('date-fns/get_time')
console.log(83)
const encodeHMACSHA256 = require('crypto-js/hmac-sha256')
console.log(84)
const { merge, toQs } = require('@nudj/library')
console.log(85)
const serialize = require('serialize-javascript')
console.log(86)

const request = require('../../lib/requestGQL')
console.log(87)
const app = require('../../redux/server')
console.log(88)
const { removeAjaxPostfix } = require('../../lib')
console.log(89)
const { AJAX_POSTFIX } = require('../../lib/constants')
console.log(810)

const getMiddleware = ({
  App,
  reduxRoutes,
  reduxReducers,
  spoofLoggedIn,
  errorHandlers,
  gqlFragments
}) => {
  console.log(811)
  function doEnsureLoggedIn (req, res, next) {
    console.log(812)
    if (req.session.logout) {
      console.log(813)
      let url = req.originalUrl.split('/')
      console.log(814)
      url.pop()
      console.log(815)
      res.redirect(url.join('/'))
      console.log(816)
    } else {
      console.log(817)
      if (req.xhr) {
        console.log(818)
        if (!req.isAuthenticated || !req.isAuthenticated()) {
          console.log(819)
          return res.status(401).send()
        }
        console.log(820)
      }
      console.log(821)
      _ensureLoggedIn.ensureLoggedIn({
        setReturnTo: !req.session.returnTo,
        redirectTo: `/login?${toQs(req.query)}`
      })(
        req,
        res,
        next
      )
      console.log(822)
    }
    console.log(823)
    delete req.session.logout
    console.log(824)
  }
  console.log(825)

  const spoofUser = process.env.SPOOF_USER === 'true'
  console.log(826)
  const ensureLoggedIn = spoofUser ? spoofLoggedIn : doEnsureLoggedIn
  console.log(827)

  function respondWith (fetcher = () => ({})) {
    console.log(828)
    return async (req, res, next) => {
      console.log(829)
      try {
        console.log(830)
        const pageData = await fetcher({
          data: {},
          params: req.params,
          body: req.body,
          files: req.files,
          query: req.query,
          session: req.session
        })
        console.log(831)
        render(req, res, next, pageData)
        console.log(832)
      } catch (error) {
        console.log(833)
        console.error(error)
        console.log(834)
        next(error)
        console.log(835)
      }
      console.log(836)
    }
  }
  console.log(838)

  async function fetchUser (userId) {
    console.log(839)
    if (!userId) return null
    console.log(840)

    const gql = `
      query fetchUser {
        user {
          email
          firstName
          lastName
        }
      }
    `
    console.log(841)

    const { user } = await request(userId, gql)
    console.log(842)
    return user
  }
  console.log(844)

  function respondWithGql (gqlQueryComposer = () => ({})) {
    console.log(841)
    return async (req, res, next) => {
      console.log(842)
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
      console.log(843)
      try {
        console.log(844)
        let pageData = {}
        console.log(845)
        if (typeof gql === 'string') pageData = await request(req.session.userId, gql, variables)
        console.log(846)
        if (typeof transformData === 'function') {
          console.log(847)
          pageData = await transformData(pageData)
          console.log(848)
        }
        console.log(849)
        if (typeof respond === 'function') return await respond(pageData)
        console.log(850)

        render(req, res, next, pageData)
        console.log(851)
      } catch (error) {
        console.log(852)
        if (error.constructor.name === 'Redirect') return next(error)
        console.log(853)
        console.error(error)
        console.log(854)

        if (typeof catcher === 'function') {
          console.log(855)
          try {
            console.log(856)
            return catcher(error)
          } catch (error) {
            console.log(857)
            console.error(error)
            console.log(858)
            next(error)
            console.log(859)
          }
          console.log(860)
        }
        console.log(861)
        next(error)
        console.log(862)
      }
      console.log(863)
    }
  }
  console.log(865)

  function render (req, res, next, renderData) {
    console.log(866)
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
    console.log(867)
    if (req.session.notification) {
      console.log(868)
      renderData.notification = req.session.notification
      console.log(869)
      delete req.session.notification
      console.log(870)
    }
    console.log(871)
    respond(req, res, next, renderData)
    console.log(872)
  }
  console.log(873)

  async function respond (req, res, next, renderData) {
    console.log(874)
    delete req.session.logout
    console.log(875)
    delete req.session.returnTo
    console.log(876)

    renderData = { app: renderData }
    console.log(877)

    // if ajax request (url ends with `/json`) respond with json
    console.log(878)
    if (req.path.endsWith(AJAX_POSTFIX)) {
      console.log(879)
      return res.json(renderData)
    }
    console.log(880)

    // otherwise respond with React rendered html
    console.log(881)
    let staticContext = app({
      App,
      reduxRoutes,
      reduxReducers,
      data: renderData
    })
    console.log(882)
    if (staticContext.url) {
      console.log(883)
      res.redirect(staticContext.url)
      console.log(884)
    } else {
      console.log(885)
      const user = await fetchUser(req.session.userId)
      console.log(886)
      let status = get(
        renderData,
        'app.error.code',
        staticContext.status || 200
      )
      console.log(887)
      let intercomUserToken = null
      console.log(888)
      let email = null
      console.log(889)
      let fullname = null
      console.log(890)

      if (user && user.email) {
        console.log(891)
        // Similar to intercom.createUser (creates a user if they do not exist)
        console.log(892)
        intercomUserToken = encodeHMACSHA256(user.email, process.env.INTERCOM_SECRET_KEY)
        console.log(893)
        email = user.email
        console.log(894)
      }
      console.log(895)

      if (user && user.firstName && user.lastName) {
        console.log(896)
        fullname = `${user.firstName} ${user.lastName}`
        console.log(897)
      }
      console.log(898)

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
      console.log(899)
    }
    console.log(8100)
  }
  console.log(8101)

  return {
    ensureLoggedIn,
    respondWith,
    respondWithGql,
    render
  }
}
console.log(8102)

module.exports = getMiddleware
