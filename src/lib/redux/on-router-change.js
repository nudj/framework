const { replace } = require('@nudj/react-router-redux')

const {
  setPage,
  showLoading,
  showError,
  showNotFound
} = require('./actions')
const request = require('../lib/request')
const { addAjaxPostfix } = require('../lib')
const { Unauthorized, NotFound } = require('../lib/errors')

function getOnRouterChange (store) {
  const latestRequest = {}

  return (dispatch, location, historyAction) => {
    const url = location.pathname
    const query = location.search
    const hash = location.key
    const state = store.getState()
    if (url + query !== state.app.url.originalUrl) {
      dispatch(showLoading())
      latestRequest.hash = hash
      latestRequest.url = url
      return request(addAjaxPostfix(url + query))
        .then((data) => {
          if (data) {
            // only update page state if this is the latest request
            if (hash === latestRequest.hash) {
              dispatch(setPage(data))
            }

            let [originalPathname, originalSearch] = data.app.url.originalUrl.split('?')
            originalPathname = originalPathname || '/'
            const newPathname = window.location.pathname
            const newSearch = window.location.search.split('?')[1]

            /**
             * if the url inside the data does not match the original request it
             * means a redirect has been followed by the browser so the url
             * needs to be updated to match
             */
            if (
              originalPathname !== newPathname ||
              originalSearch !== newSearch
            ) {
              dispatch(replace(data.app.url.originalUrl))
            }
          }
        })
        .catch((error) => {
          console.error(error)
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
    return Promise.resolve()
  }
}

module.exports = getOnRouterChange
