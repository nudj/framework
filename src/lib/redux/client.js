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

const getRenderApp = (store, handleRouterChange, history) => (App, routes, loader) => {
  render(
    <Provider store={store}>
      <ConnectedRouter history={history} onChange={handleRouterChange}>
        <App {...data.app} history={history}>
          <Framework Loader={loader}>
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

const initialiseClient = (reducers) => {
  const history = createBrowserHistory()

  const store = getConfigureStore({
    router: routerReducer,
    app: appReducer,
    ...reducers
  }, history)(data)

  const handleRouterChange = getOnRouterChange(store)
  StyleSheet.rehydrate(renderedClassNames)

  return {
    store,
    render: getRenderApp(store, handleRouterChange, history)
  }
}

module.exports = initialiseClient
