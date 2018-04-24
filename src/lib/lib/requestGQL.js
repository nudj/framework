const libRequest = require('@nudj/library/request')
const get = require('lodash/get')
const logger = require('./logger')

async function request (userId, query, variables) {
  try {
    const response = await libRequest(`http://${process.env.API_HOST}:82/`, {
      method: 'post',
      data: {
        userId,
        query,
        variables
      }
    })
    if (response.errors) {
      response.errors.forEach(error =>
        logger.log('error', error.message, query, variables)
      )
      throw new Error(response.errors[0].message)
    }
    return response.data
  } catch (error) {
    get(error, 'response.data.errors', []).forEach(error =>
      logger.log('error', error)
    )
    throw error
  }
}

function openRequest (url, options) {
  return libRequest(url, options)
}

module.exports = request
module.exports.openRequest = openRequest
