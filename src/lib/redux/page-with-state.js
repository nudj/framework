const React = require('react')
const { withRouter } = require('react-router-dom')
const { connect } = require('react-redux')
const { merge } = require('@nudj/library')
const get = require('lodash/get')
const omit = require('lodash/omit')

const { initialise } = require('./actions')
const Status = require('../components/status')
const ErrorPage = require('../components/error-page')
const Loading = require('../components/loading')

class Component extends React.Component {
  componentDidMount () {
    const initialised = get(this.props, 'app.initialised')
    if (!initialised) {
      this.props.dispatch(initialise())
    }
  }
  render () {
    const error = get(this.props, 'app.error')
    const loading = get(this.props, 'app.loading')
    let Page
    switch (true) {
      case !!error:
        Page = (props) => (
          <Status code={error.code}>
            <ErrorPage error={error} />
          </Status>
        )
        break
      case !!loading:
        Page = Loading
        break
      default:
        Page = this.props.component
    }
    return <Page {...omit(this.props, ['app', 'component'])} {...this.props.app} />
  }
}

const PageWithState = (Page) => {
  return withRouter(connect(merge)((props) => <Component component={Page} {...props} />))
}

module.exports = PageWithState
