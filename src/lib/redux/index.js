const React = require('react')
const { Switch, Route } = require('react-router-dom')

const pageWithStateInit = require('./page-with-state')
const Status = require('../components/status')
const ErrorPage = require('../components/error-page')

const objectMapToArray = (obj, fn) => {
  return Object.keys(obj).map(key => fn(key, obj[key]))
}

const FrameworkReduxRoot = ({ LoadingComponent }) => (props) => {
  const App = props.App
  const PageWithState = pageWithStateInit({ LoadingComponent })

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
