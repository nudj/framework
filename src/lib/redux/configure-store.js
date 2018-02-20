const { createStore, combineReducers, applyMiddleware } = require('redux')
const { routerMiddleware } = require('@nudj/react-router-redux')
const thunkMiddleware = require('redux-thunk').default
const { composeWithDevTools } = require('redux-devtools-extension')

module.exports = function getConfigureStore (reducers, history) {
  let middleware

  if (history) {
    const historyMiddleware = routerMiddleware(history)
    middleware = applyMiddleware(thunkMiddleware, historyMiddleware)
  } else {
    middleware = applyMiddleware(thunkMiddleware)
  }

  return function configureStore (initialState) {
    return createStore(
      combineReducers(reducers),
      initialState,
      composeWithDevTools(middleware)
    )
  }
}
