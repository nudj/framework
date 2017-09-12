const React = require('react')
const { Switch, Route } = require('react-router-dom')
const get = require('lodash/get')

const PageWithState = require('./page-with-state')
const Status = require('../components/status')
const ErrorPage = require('../components/error-page')
const PageNotFound = require('../components/404-page')

const objectMapToArray = (obj, fn) => {
  return Object.keys(obj).map(key => fn(key, obj[key]))
}

const FrameworkReduxRoot = (props) => {
  const App = props.App
  const error = get(props, 'error')

  if (error) {
    return (
      <Status code={error.code}>
        <ErrorPage error={error} />
      </Status>
    )
  }
  return (
    <App>
      <Switch>
        {objectMapToArray(props.routes || [], (path, component) => <Route exact key={path} path={path} component={PageWithState(component)} />)}
        <Route render={PageWithState((props) => (
          <Status code={404}>
            <ErrorPage error={{ code: 404 }} />
          </Status>
        ))} />
      </Switch>
    </App>
  )
}

module.exports = FrameworkReduxRoot
