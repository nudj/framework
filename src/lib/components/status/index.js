const React = require('react')
const { Route } = require('react-router-dom')

const Status = ({ code, children }) => (
  <Route render={({ staticContext }) => {
    if (staticContext) {
      staticContext.status = code
    }
    return children
  }} />
)

module.exports = Status
