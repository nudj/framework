const React = require('react')

const getStyle = require('./error-page.css')
const PageNotFound = require('../404-page')
const ServerError = require('../500-page')

const ErrorPage = (props) => {
  const style = getStyle()
  let html
  if (props.code === 404) {
    html = <PageNotFound />
  } else {
    html = <ServerError />
  }
  return (
    <div className={style.body}>
      {html}
    </div>
  )
}

module.exports = ErrorPage
