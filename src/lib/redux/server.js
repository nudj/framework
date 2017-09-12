const React = require('react')
const ReactDOMServer = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')
const { Provider } = require('react-redux')
const { createStore, combineReducers, applyMiddleware } = require('redux')
const { Helmet } = require('react-helmet')
const { StyleSheetServer } = require('aphrodite/no-important')
const thunkMiddleware = require('redux-thunk').default
const { merge } = require('@nudj/library')

const ReduxApp = require('./')
const appReducer = require('./reducers/app')

module.exports = ({
  App,
  reduxRoutes,
  reduxReducers,
  data
}) => {
  const store = createStore(
    combineReducers(merge({
      app: appReducer
    }, reduxReducers)),
    data,
    applyMiddleware(thunkMiddleware)
  )
  const context = {}
  const { html, css } = StyleSheetServer.renderStatic(() => {
    return ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter
          location={data.app.url.originalUrl}
          context={context}
        >
          <ReduxApp {...data.app} App={App} routes={reduxRoutes} />
        </StaticRouter>
      </Provider>
    )
  })
  context.html = html
  context.css = css
  context.helmet = Helmet.renderStatic()
  return context
}
