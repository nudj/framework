// MOVE TO @nudj/library

const Axios = require('axios')
const get = require('lodash/get')
const {
  Unauthorized,
  NotFound,
  AppError
} = require('./errors')

let config = {
  baseURL: '/',
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
}
try {
  if (process.title.includes('node')) {
    config.baseURL = 'http://api:81/'
  }
} catch (error) {
  console.log('Browser')
}
const axios = Axios.create(config)

function request (uri, options) {
  return axios(uri, options)
    .then((response) => response.data)
    .catch((error) => {
      switch (get(error, 'response.status')) {
        case 401:
          throw new Unauthorized({ type: error.response.data })
        case 404:
          throw new NotFound(`request - ${config.baseURL}${uri}`, options)
        default:
          throw new AppError(error.message, `request - ${config.baseURL}${uri}`, options)
      }
    })
}

module.exports = request
