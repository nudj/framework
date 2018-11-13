const libRequest = require('@nudj/library/request')
const get = require('lodash/get')
const logger = require('./logger')

function createErrorFromObject (errorObject) {
  console.log('errorObject', errorObject)
  const error = new Error(errorObject.message)
  Object.keys(errorObject).forEach(key => {
    error[key] = errorObject[key]
  })
  return error
}

async function request (userId, query, variables) {
  try {
    const response = await libRequest(`http://${process.env.API_HOST}:${process.env.API_PORT}/`, {
      method: 'post',
      data: {
        userId,
        query,
        variables
      }
    })
    if (response.errors) {
      logger.log('error', query, variables)
      response.errors.forEach(error =>
        logger.log('error', error.id || 'ERROR', error.message)
      )

      // The errors in the array will be of the same type and thus
      // only one needs to be returned to the app.
      throw createErrorFromObject(response.errors[0])
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
