const React = require('react')
const { withRouter } = require('react-router-dom')
const { connect } = require('react-redux')
const { merge } = require('@nudj/library')

class Component extends React.Component {
  render () {
    const Page = this.props.component
    return (
      <Page {...this.props.app} dispatch={this.props.dispatch} historyAction={this.props.history.action} />
    )
  }
}

const PageWithState = (Page) => {
  return withRouter(connect(merge)((props) => <Component component={Page} {...props} />))
}

module.exports = PageWithState
