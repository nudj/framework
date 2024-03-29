const { push, replace } = require('@nudj/react-router-redux')
const get = require('lodash/get')

const request = require('../lib/request')
const { addAjaxPostfix } = require('../lib')
const {
  Unauthorized,
  NotFound
} = require('../lib/errors')

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

const SHOW_LOADING = 'SHOW_LOADING'
module.exports.SHOW_LOADING = SHOW_LOADING
function showLoading () {
  return {
    type: SHOW_LOADING
  }
}
module.exports.showLoading = () => {
  return (dispatch, getState) => {
    dispatch(hideNotification())
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
module.exports.showNotification = (nextNotification) => {
  return (dispatch, getState) => {
    const {
      app: {
        notification: currentNotification
      }
    } = getState()

    if (currentNotification) dispatch(hideNotification())

    dispatch(showNotification(nextNotification))
  }
}

const SHOW_ERROR = 'SHOW_ERROR'
module.exports.SHOW_ERROR = SHOW_ERROR
function showError () {
  return {
    type: SHOW_ERROR
  }
}
module.exports.showError = () => {
  return (dispatch, getState) => {
    dispatch(showError())
  }
}

const SHOW_NOT_FOUND = 'SHOW_NOT_FOUND'
module.exports.SHOW_NOT_FOUND = SHOW_NOT_FOUND
function showNotFound () {
  return {
    type: SHOW_NOT_FOUND
  }
}
module.exports.showNotFound = () => {
  return (dispatch, getState) => {
    dispatch(showNotFound())
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
  data,
  showLoadingState = true,
  params
}, callback) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(hideDialog())
    if (showLoadingState) dispatch(showLoading())
    return request({
      url: addAjaxPostfix(url),
      method,
      data,
      headers: {
        'X-CSRF-TOKEN': state.app.csrfToken
      },
      params
    })
    .then((data) => {
      const currentUrl = `${window.location.pathname}${window.location.search}`
      const requestedPath = url
      const resolvedUrl = data.app.url.originalUrl
      const resolvedPath = data.app.url.path

      if (resolvedPath !== requestedPath) {
        dispatch(push(resolvedUrl))
      } else if (resolvedUrl !== currentUrl) {
        dispatch(replace(resolvedUrl))
      } else {
        callback && callback()
      }

      return dispatch(fetchedPage(data))
    })
    .catch((error) => {
      if (process.env.NODE_ENV !== 'production') console.error(error)
      const authorities = {
        nudj: '',
        Google: '/auth/google'
      }
      if (error.name === Unauthorized.prototype.name) {
        const authority = error.type
        window.location = (authority && authorities[authority]) || authorities.nudj
        return
      }
      if (error.name === NotFound.prototype.name) {
        return dispatch(showNotFound())
      }
      dispatch(showError())
    })
  }
}

module.exports.postFile = ({
  url,
  method = 'post',
  file,
  data
}) => {
  const formData = new window.FormData()
  formData.append('file', file)
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })

  return (dispatch, getState) => {
    const state = getState()
    formData.append('_csrf', state.app.csrfToken)

    dispatch(hideDialog())
    dispatch(showLoading())
    request(addAjaxPostfix(url), {
      method,
      data: formData
    })
    .then((data) => {
      dispatch(fetchedPage(data))
      if (data.app.url.originalUrl !== url) {
        dispatch(push(data.app.url.originalUrl))
      }
    })
  }
}
