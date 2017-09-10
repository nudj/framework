const { StyleSheet, css: _css } = require('aphrodite/no-important')
const variables = require('./variables')
const mixins = require('./mixins')
const { merge } = require('@nudj/library')

const css = (stylesheet) => {
  return () => {
    const styles = StyleSheet.create(stylesheet)
    return Object.keys(stylesheet).reduce((classList, className) => {
      classList[className] = _css(styles[className])
      return classList
    }, {})
  }
}
// eventually we would just modify the `css` function above to behave like the function below but it requires a refactor of all the components in the app to directly process style functions
const cssProcessor = (styles) => {
  return css(styles({
    merge,
    mixins,
    variables
  }))()
}

module.exports = {
  css,
  cssProcessor,
  merge,
  variables,
  mixins
}
