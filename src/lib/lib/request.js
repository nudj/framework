// MOVE TO @nudj/library

const Axios = require('axios')
const get = require('lodash/get')

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
      if (get(error, 'response.status') === 401) {
        throw new Error('Unauthorized')
      }
      console.log('error', error.message, `request - ${config.baseURL}${uri}`, options)
      throw new Error('Something went wrong')
    })
}

module.exports = request
