const React = require('react')
const get = require('lodash/get')
const getStyle = require('./notification.css')
const { hideNotification } = require('../../redux/actions/app')

const onClickClose = (props) => (event) => props.dispatch(hideNotification())

class Notification extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    this.state = {
      js: false
    }
  }
  componentDidMount () {
    this.setState({
      js: true
    })
  }
  render () {
    const notification = get(this.props, 'notification')
    const type = get(notification, 'type')
    const typeClass = type ? this.style[type] : ''
    const stateClass = notification && !get(notification, 'hide') ? this.style.visible : ''
    return <div className={`${this.style.notification} ${typeClass} ${stateClass}`}>
      <div className={this.style.message}>{get(notification, 'message', '')}</div>
      {get(this.state, 'js') ? <button className={this.style.close} onClick={onClickClose(this.props)}><img className={this.style.closeIcon} src='/assets/images/close.svg' alt='Close' /></button> : null}
    </div>
  }
}

module.exports = Notification
