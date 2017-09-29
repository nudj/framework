const { merge } = require('@nudj/library')

const {
  INITIALISED,
  SENDING,
  FETCHED_PAGE,
  SHOW_DIALOG,
  HIDE_DIALOG,
  SHOW_LOADING,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
  SHOW_ERROR
} = require('./actions')

const initialState = {}

function appReducer (state = initialState, action) {
  switch (action.type) {
    case INITIALISED:
      return merge(state, { initialised: true, notification: action.notification })
    case SENDING:
      return merge(state, { sending: true, notification: null })
    case SHOW_LOADING:
      return merge(state, { loading: true })
    case FETCHED_PAGE:
      return merge(action.data.app, {
        sending: false,
        loading: false
      })
    case SHOW_DIALOG:
      return merge(state, { overlay: action.dialog })
    case HIDE_DIALOG:
      return merge(state, { overlay: null })
    case SHOW_NOTIFICATION:
      return merge(state, { notification: merge(action.notification, { hide: false }) })
    case HIDE_NOTIFICATION:
      return merge(state, { notification: { hide: true, timer: false } })
    case SHOW_ERROR:
      return merge(state, { error: { code: 500 }, loading: false })
    default:
      return state
  }
}

module.exports = appReducer
