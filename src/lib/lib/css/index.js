const { StyleSheet, css: _css } = require('aphrodite/no-important')
const { merge } = require('@nudj/library')

const variables = require('./variables')
const mixins = require('./mixins')
const extensions = require('./extensions')

const Extended = StyleSheet.extend(extensions)

const css = (stylesheet) => {
  return () => {
    const styles = Extended.StyleSheet.create(stylesheet)
    return Object.keys(stylesheet).reduce((classList, className) => {
      classList[className] = Extended.css(styles[className])
      return classList
    }, {})
  }
}
// TODO: eventually we would just modify the `css` function above to behave like the function below but it requires a refactor of all the components in the app to directly process style functions
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
