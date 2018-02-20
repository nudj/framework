const React = require('react')
const connectState = require('./connect-state')
const { initialise } = require('./actions')
const Status = require('../components/status')
const ErrorPage = require('../components/error-page')
const Loading = require('../components/loading')

class Framework extends React.Component {
  componentDidMount () {
    const initialised = this.props.app.initialised
    if (!initialised) {
      this.props.dispatch(initialise())
    }
  }

  render () {
    const {
      Loader,
      app: {
        error,
        loading
      },
      children
    } = this.props

    if (error) {
      return (
        <Status code={error.code}>
          <ErrorPage error={error} />
        </Status>
      )
    } else if (loading) {
      return <Loader {...this.props} />
    }

    return children
  }
}

Framework.defaultProps = {
  Loader: Loading
}

module.exports = connectState(Framework)
