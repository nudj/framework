const React = require('react')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')
const getStyle = require('./404-page.css')

const NotFound = (props) => {
  const style = getStyle()
  return (
    <div className={style.content}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>nudj - oops you're lost</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Helmet>
      <header className={style.header}>
        <h1 className={style.title}>404</h1>
      </header>
      <p className={style.copy}>We can't seem to find the page you're looking for.</p>
      <p className={style.copy}>Here are some helpful links instead:</p>
      <div className={style.pages}>
        <Link className={style.link} to='/'>Home</Link>
        <Link className={style.link} to='/request'>Request access</Link>
        <Link className={style.link} to='' id='open-intercom'>Contact us</Link>
      </div>
    </div>
  )
}

module.exports = NotFound
