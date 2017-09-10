const React = require('react')

module.exports = class ScrollTop extends React.Component {
  componentDidMount () {
    if (!this.props.ignore) {
      window.scroll(0, 0)
    }
  }
  render () {
    return this.props.children
  }
}
