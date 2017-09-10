// MOVE TO @nudj/library

const logger = require('./logger')
const { merge } = require('@nudj/library')

function NudjError (message, type, data) {
  this.message = message
  this.type = type
  this.data = data
  Error.captureStackTrace(this, NudjError)
  logger.log('error', this)
}
NudjError.prototype = merge(Error.prototype)
NudjError.prototype.name = 'NudjError'

module.exports = NudjError
