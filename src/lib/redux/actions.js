const { push } = require('@nudj/react-router-redux')
const get = require('lodash/get')
const { merge } = require('@nudj/library')

const request = require('../lib/request')

const INITIALISED = 'INITIALISED'
module.exports.INITIALISED = INITIALISED
function initialised (notification) {
  return {
    type: INITIALISED,
    notification
  }
}
module.exports.initialise = () => {
  return (dispatch, getState) => {
    const state = getState()
    const notification = get(state, 'app.notification')
    if (notification) {
      notification.timer = setTimeout(() => dispatch(hideNotification()), 5000)
    }
    dispatch(initialised(notification))
  }
}

const FETCHED_PAGE = 'FETCHED_PAGE'
module.exports.FETCHED_PAGE = FETCHED_PAGE
function fetchedPage (data) {
  return {
    type: FETCHED_PAGE,
    data
  }
}
module.exports.setPage = (data) => {
  return (dispatch, getState) => {
    dispatch(fetchedPage(data))
  }
}

const SENDING = 'SENDING'
module.exports.SENDING = SENDING
function sending () {
  return {
    type: SENDING
  }
}
module.exports.sending = () => {
  return (dispatch, getState) => {
    dispatch(sending())
  }
}

const SHOW_LOADING = 'SHOW_LOADING'
module.exports.SHOW_LOADING = SHOW_LOADING
function showLoading () {
  return {
    type: SHOW_LOADING
  }
}
module.exports.showLoading = () => {
  return (dispatch, getState) => {
    dispatch(showLoading())
  }
}

const SHOW_DIALOG = 'SHOW_DIALOG'
module.exports.SHOW_DIALOG = SHOW_DIALOG
function showDialog (dialog) {
  return {
    type: SHOW_DIALOG,
    dialog
  }
}
module.exports.showDialog = (dialog) => {
  return (dispatch, getState) => {
    dispatch(showDialog(dialog))
  }
}

const HIDE_DIALOG = 'HIDE_DIALOG'
module.exports.HIDE_DIALOG = HIDE_DIALOG
function hideDialog () {
  return {
    type: HIDE_DIALOG
  }
}
module.exports.hideDialog = () => {
  return (dispatch, getState) => {
    dispatch(hideDialog())
  }
}

const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
module.exports.SHOW_NOTIFICATION = SHOW_NOTIFICATION
function showNotification (notification) {
  return {
    type: SHOW_NOTIFICATION,
    notification
  }
}
module.exports.showNotification = (notification) => {
  return (dispatch, getState) => {
    const state = getState()
    if (!get(state, 'notification.timer')) {
      notification.timer = setTimeout(() => dispatch(hideNotification()), 5000)
      dispatch(showNotification(notification))
    }
  }
}

const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION'
module.exports.HIDE_NOTIFICATION = HIDE_NOTIFICATION
function hideNotification () {
  return {
    type: HIDE_NOTIFICATION
  }
}
module.exports.hideNotification = () => {
  return (dispatch, getState) => {
    dispatch(hideNotification())
  }
}

module.exports.postData = ({
  url,
  method = 'post',
  data
}) => {
  return (dispatch, getState) => {
    let state = getState()
    dispatch(sending())
    request(url, {
      method,
      data: merge(data, {
        _csrf: state.app.csrfToken
      })
    })
    .then((data) => {
      const notification = get(data, 'app.notification')
      if (notification) {
        data.app.notification.timer = setTimeout(() => dispatch(hideNotification()), 5000)
      }
      dispatch(fetchedPage(data))
      if (data.app.url.originalUrl !== url) {
        dispatch(push(data.app.url.originalUrl))
      }
    })
  }
}
