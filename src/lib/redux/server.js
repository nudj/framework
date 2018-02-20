const React = require('react')
const ReactDOMServer = require('react-dom/server')
const { StaticRouter, Switch } = require('react-router-dom')
const { Provider } = require('react-redux')
const { Helmet } = require('react-helmet')
const { StyleSheetServer } = require('aphrodite/no-important')

const getConfigureStore = require('./configure-store')
const Framework = require('./framework')
const appReducer = require('./reducer')
const createReactRoutes = require('./create-react-routes')
const NotFoundRoute = require('./not-found-route')
const logger = require('../lib/logger')

logger.log('info', 'Server', 'process.env.NODE_ENV', process.env.NODE_ENV)

module.exports = ({
  App,
  reduxRoutes,
  reduxReducers,
  data,
  LoadingComponent
}) => {
  const store = getConfigureStore({
    app: appReducer,
    ...reduxReducers
  })(data)

  const routes = createReactRoutes(reduxRoutes)

  const context = {}
  const { html, css } = StyleSheetServer.renderStatic(() => {
    return ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter
          location={data.app.url.originalUrl}
          context={context}
        >
          <App {...data.app}>
            <Framework Loader={LoadingComponent}>
              <Switch>
                {routes}
                <NotFoundRoute />
              </Switch>
            </Framework>
          </App>
        </StaticRouter>
      </Provider>
    )
  })
  context.html = html
  context.css = css
  context.helmet = Helmet.renderStatic()
  return context
}
