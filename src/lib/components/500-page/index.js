const React = require('react')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')
const getStyle = require('./500-page.css')

const ServerError = (props) => {
  const style = getStyle()
  return (
    <div className={style.content}>
      <Helmet>
        <title>ADMIN - something went wrong</title>
      </Helmet>
      <div className={style.gif}>
        <img src='https://media.giphy.com/media/ZeB4HcMpsyDo4/giphy.gif' width='320' height='202' />
      </div>
      <p className={style.header}>Dang-it!</p>
      <p className={style.copy}>That wasn't supposed to happen.</p>
      <small className={style.error}>Error code: 500</small>
      <p className={style.copy}>An error has occurred and we're working to fix the problem! We’ll be up and running again shortly.</p>
      <p className={style.copy}>If you need immediate help, then please <Link className={style.link} to='' id='open-intercom'>contact us</Link>.</p>
    </div>
  )
}

module.exports = ServerError
