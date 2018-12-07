const { merge } = require('@nudj/library')

const {
  INITIALISED,
  FETCHED_PAGE,
  SHOW_DIALOG,
  HIDE_DIALOG,
  SHOW_LOADING,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
  SHOW_NOT_FOUND,
  SHOW_ERROR
} = require('./actions')

const initialState = {}

function appReducer (state = initialState, action) {
  switch (action.type) {
    case INITIALISED:
      return merge(state, { initialised: true, notification: action.notification })
    case SHOW_LOADING:
      return merge(state, { loading: true })
    case FETCHED_PAGE:
      return merge(action.data.app, {
        sending: false,
        loading: false,
        notification: action.data.app.notification || state.notification
      })
    case SHOW_DIALOG:
      return merge(state, { overlay: action.dialog })
    case HIDE_DIALOG:
      return merge(state, { overlay: null })
    case SHOW_NOTIFICATION:
      return merge(state, { notification: merge(action.notification, { hide: false }) })
    case HIDE_NOTIFICATION:
      return merge(state, { notification: { hide: true } })
    case SHOW_NOT_FOUND:
      return merge(state, { error: { code: 404 }, loading: false })
    case SHOW_ERROR:
      return merge(state, { error: { code: 500 }, loading: false })
    default:
      return state
  }
}

module.exports = appReducer
