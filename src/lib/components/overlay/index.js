const React = require('react')
const getStyle = require('./overlay.css')
const { hideDialog } = require('../../redux/actions')

function onClickBackground (props) {
  return (event) => props.dispatch(hideDialog())
}

function onClickClose (props) {
  return (event) => props.dispatch(hideDialog())
}

function onClickDialog () {
  return (event) => event.stopPropagation()
}

const Overlay = (props) => {
  const style = getStyle()
  return <div className={props.overlay ? style.background : style.hidden} onClick={onClickBackground(props)}>
    <div className={style.dialog} onClick={onClickDialog(props)}>
      <button className={style.close} onClick={onClickClose(props)} />
      {props.overlay}
    </div>
  </div>
}

module.exports = Overlay
