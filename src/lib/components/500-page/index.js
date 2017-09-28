const React = require('react')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')
const getStyle = require('./500-page.css')

const ServerError = (props) => {
  const style = getStyle()
  return (
    <div className={style.content}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>nudj - something went wrong</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Helmet>
      <header className={style.header}>
        <h1 className={style.title}>500</h1>
      </header>
      <p className={style.copy}>That wasn't supposed to happen.</p>
      <p className={style.copy}>An error has occurred and we're working to fix the problem! We’ll be up and running again shortly.</p>
      <p className={style.copy}>If you need immediate help, then please <Link className={style.copyLink} to='' id='open-intercom'>contact us</Link>. Otherwise try going back or visit our <Link className={style.copyLink} to='/'>home page</Link>.</p>
    </div>
  )
}

module.exports = ServerError
