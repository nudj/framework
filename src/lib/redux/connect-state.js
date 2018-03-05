const React = require('react')
const { withRouter } = require('react-router-dom')
const { connect } = require('react-redux')
const { merge } = require('@nudj/library')

const connectState = Component => withRouter(
  connect(merge)((props) => <Component {...props} {...props.app} />)
)

module.exports = connectState
