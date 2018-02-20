/* global data renderedClassNames */
const React = require('react')
const { render } = require('react-dom')
const { Switch } = require('react-router-dom')
const { Provider } = require('react-redux')
const { createBrowserHistory } = require('history')
const { ConnectedRouter, routerReducer } = require('@nudj/react-router-redux')
const { StyleSheet } = require('aphrodite/no-important')

const appReducer = require('./reducer')
const getOnRouterChange = require('./on-router-change')
const getConfigureStore = require('./configure-store')
const Framework = require('./framework')
const NotFoundRoute = require('./not-found-route')
const createReactRoutes = require('./create-react-routes')

const Client = ({
  App,
  reduxRoutes,
  reduxReducers,
  LoadingComponent
}) => {
  const history = createBrowserHistory()

  /**
   * Moving `getConfigureStore` to hire will allow for hot reloading of
   * reducers and actions.
   *
   * Alternatively, we could expose the store AND render method to hire so
   * it can use `replaceReducer` as below
   */
  const store = getConfigureStore({
    router: routerReducer,
    app: appReducer,
    ...reduxReducers
  }, history)(data)

  /**
   * Although I'm not 100% sure how to pass the store down to `handleRouterChange`...
   * it may work fine as is, given `store` stays the same, and we use `store.replaceReducer`
   * to enable hot reloading
   */
  const handleRouterChange = getOnRouterChange(store)

  const routes = createReactRoutes(reduxRoutes)

  StyleSheet.rehydrate(renderedClassNames)
  render(
    <Provider store={store}>
      <ConnectedRouter history={history} onChange={handleRouterChange}>
        <App {...data.app} history={history}>
          <Framework Loader={LoadingComponent}>
            <Switch>
              {routes}
              <NotFoundRoute />
            </Switch>
          </Framework>
        </App>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
  )
}

module.exports = Client
