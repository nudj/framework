const React = require('react')
const getStyle = require('./style.css')

const Loading = () => {
  const style = getStyle()
  return <div className={style.loading}>
    <div className={style.body}>
      <div className={style.spinner} />
    </div>
  </div>
}

module.exports = Loading
