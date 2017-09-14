const React = require('react')
const { withRouter } = require('react-router-dom')
const { connect } = require('react-redux')
const { merge } = require('@nudj/library')
const get = require('lodash/get')

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
    const Page = this.props.component
    return (
      loading ? <Loading {...this.props.app} /> : <Page {...this.props.app} dispatch={this.props.dispatch} historyAction={this.props.history.action} />
    )
  }
}

const PageWithState = (Page) => {
  return withRouter(connect(merge)((props) => <Component component={Page} {...props} />))
}

module.exports = PageWithState
