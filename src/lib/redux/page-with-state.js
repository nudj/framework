const React = require('react')
const { withRouter } = require('react-router-dom')
const { connect } = require('react-redux')
const { merge } = require('@nudj/library')
const get = require('lodash/get')
const omit = require('lodash/omit')

const { initialise } = require('./actions')
const Loading = require('../components/loading')

class Component extends React.Component {
  componentDidMount () {
    const initialised = get(this.props, 'app.initialised')
    if (!initialised) {
      this.props.dispatch(initialise())
    }
  }
  render () {
    const loading = get(this.props, 'app.loading')
    const Page = loading ? Loading : this.props.component
    return <Page {...omit(this.props, ['app', 'component'])} {...this.props.app} />
  }
}

const PageWithState = (Page) => {
  return withRouter(connect(merge)((props) => <Component component={Page} {...props} />))
}

module.exports = PageWithState
