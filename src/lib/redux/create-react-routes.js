const React = require('react')
const connectState = require('./connect-state')
const { Route } = require('react-router-dom')

const objectMapToArray = (obj, fn) => {
  return Object.keys(obj).map(key => fn(key, obj[key]))
}

const createReactRoutes = routes => objectMapToArray(
  routes,
  (path, component) => (
    <Route
      exact
      key={path}
      path={path}
      component={connectState(component)}
    />
  )
)

module.exports = createReactRoutes
