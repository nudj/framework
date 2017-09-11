const React = require('react')
const { Helmet } = require('react-helmet')
const get = require('lodash/get')

const ScrollTop = require('../scroll-top')
const ErrorPage = require('../error-page')
const Status = require('../status')
const Notification = require('../notification')
const Overlay = require('../overlay')

const Page = (props) => {
  const error = get(props, 'error')

  if (error) {
    return (
      <Status code={error.code}>
        <ErrorPage error={error} />
      </Status>
    )
  }
  return (
    <ScrollTop ignore={props.historyAction === 'REPLACE'}>
      <div className={`${props.className}`}>
        <Helmet>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='title' content='nudj' />
          <title>nudj</title>
        </Helmet>
        <Notification notification={props.notification} dispatch={props.dispatch} />
        {props.children}
        <Overlay overlay={props.overlay} dispatch={props.dispatch} />
      </div>
    </ScrollTop>
  )
}

module.exports = Page
