const React = require('react')
const { Route } = require('react-router-dom')

const Status = require('../components/status')
const ErrorPage = require('../components/error-page')

const NotFoundRoute = (props) => (
  <Route {...props} render={() => (
    <Status code={404}>
      <ErrorPage error={{ code: 404 }} />
    </Status>
  )} />
)

module.exports = NotFoundRoute
