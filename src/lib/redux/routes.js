const React = require('react')
const { Switch, Route } = require('react-router-dom')

const PageWithState = require('./page-with-state')
const Status = require('../components/status')
const PageNotFound = require('../components/404-page')

const objectMapToArray = (obj, fn) => {
  return Object.keys(obj).map(key => fn(key, obj[key]))
}

module.exports = (props) => (
  <Switch>
    {objectMapToArray(props.routes || [], (path, component) => <Route exact key={path} path={path} component={PageWithState(component)} />)}
    <Route render={PageWithState((props) => <Status code={404}><PageNotFound {...props} /></Status>)} />
  </Switch>
)
