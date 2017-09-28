function LogThenRedirect (message, url, ...log) {
  this.name = 'LogThenRedirect'
  this.message = message
  this.url = url
  this.log = log
}
LogThenRedirect.prototype = Object.create(Error.prototype)
LogThenRedirect.prototype.constructor = LogThenRedirect

function LogThenError (message, ...log) {
  this.name = 'LogThenError'
  this.message = message
  this.log = log
}
LogThenError.prototype = Object.create(Error.prototype)
LogThenError.prototype.constructor = LogThenError

function LogThenNotFound (message, ...log) {
  this.name = 'LogThenNotFound'
  this.message = message
  this.log = log
}
LogThenNotFound.prototype = Object.create(Error.prototype)
LogThenNotFound.prototype.constructor = LogThenNotFound

module.exports = {
  LogThenRedirect,
  LogThenError,
  LogThenNotFound
}
