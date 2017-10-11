function Redirect ({ url, notification }, ...log) {
  this.name = 'Redirect'
  this.url = url
  this.notification = notification
  this.log = log
}
Redirect.prototype = Object.create(Error.prototype)
Redirect.prototype.constructor = Redirect

function NotFound (...log) {
  this.name = 'NotFound'
  this.log = log
}
NotFound.prototype = Object.create(Error.prototype)
NotFound.prototype.constructor = NotFound

function Unauthorized ({ type }, ...log) {
  this.name = 'Unauthorized'
  this.type = type
  this.log = log
}
Unauthorized.prototype = Object.create(Error.prototype)
Unauthorized.prototype.constructor = Unauthorized

function AppError (...log) {
  this.name = 'AppError'
  this.log = log
}
AppError.prototype = Object.create(Error.prototype)
AppError.prototype.constructor = AppError

module.exports = {
  Redirect,
  NotFound,
  Unauthorized,
  AppError
}
