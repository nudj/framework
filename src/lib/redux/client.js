/* global data renderedClassNames */

const React = require('react')
const ReactDOM = require('react-dom')
const {
  createStore,
  combineReducers,
  applyMiddleware
} = require('redux')
const { Provider } = require('react-redux')
const { createBrowserHistory } = require('history')
const {
  ConnectedRouter,
  routerMiddleware,
  routerReducer,
  replace
} = require('@nudj/react-router-redux')
const thunkMiddleware = require('redux-thunk').default
const { composeWithDevTools } = require('redux-devtools-extension')
const { StyleSheet } = require('aphrodite/no-important')
const { merge } = require('@nudj/library')

const reduxInit = require('./')
const appReducer = require('./reducer')
const {
  setPage,
  showLoading,
  showError,
  showNotFound
} = require('./actions')
const request = require('../lib/request')
const { addAjaxPostfix } = require('../lib')
const {
  Unauthorized,
  NotFound
} = require('../lib/errors')

console.log('Client', 'process.env.NODE_ENV', process.env.NODE_ENV)

const Client = ({
  App,
  reduxRoutes,
  reduxReducers,
  LoadingComponent
}) => {
  const history = createBrowserHistory()
  const historyMiddleware = routerMiddleware(history)
  const store = createStore(
    combineReducers(merge({
      router: routerReducer,
      app: appReducer
    }, reduxReducers)),
    data,
    composeWithDevTools(applyMiddleware(thunkMiddleware, historyMiddleware))
  )
  const latestRequest = {}
  const ReduxApp = reduxInit({ LoadingComponent })

  function fetchData (url, query, hash, dispatch) {
    return request(addAjaxPostfix(url + query))
      .then((data) => {
        if (data) {
          // only update page state if this is the latest request
          if (hash === latestRequest.hash) {
            dispatch(setPage(data))
          }

          let [originalPathname, originalSearch] = data.app.url.originalUrl.split('?')
          originalPathname = originalPathname || '/'
          const newPathname = window.location.pathname
          const newSearch = window.location.search.split('?')[1]

          // if the url inside the data does not match the original request it means a redirect has been followed by the browser so the url needs to be updated to match
          if (
            originalPathname !== newPathname ||
            originalSearch !== newSearch
          ) {
            dispatch(replace(data.app.url.originalUrl))
          }
        }
      })
      .catch((error) => {
        console.error(error)
        const authorities = {
          nudj: '',
          Google: '/auth/google'
        }
        if (error.name === Unauthorized.prototype.name) {
          const authority = error.type
          window.location = (authority && authorities[authority]) || authorities.nudj
          return
        }
        if (error.name === NotFound.prototype.name) {
          return dispatch(showNotFound())
        }
        dispatch(showError())
      })
  }

  StyleSheet.rehydrate(renderedClassNames)
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history} onChange={(dispatch, location, historyAction) => {
        const url = location.pathname
        const query = location.search
        const hash = location.key
        const state = store.getState()
        if (url + query !== state.app.url.originalUrl) {
          dispatch(showLoading())
          latestRequest.hash = hash
          latestRequest.url = url
          return fetchData(url, query, hash, dispatch)
        }
        return Promise.resolve()
      }}>
        <ReduxApp {...data.app} App={App} routes={reduxRoutes} />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
  )
}

module.exports = Client
