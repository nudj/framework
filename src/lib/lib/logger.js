let winston = require('winston')

winston.configure({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      humanReadableUnhandledException: true,
      prettyPrint: true,
      colorize: true,
      timestamp: true
    })
  ]
})

winston.log('info', 'Starting app: logging set to %s', winston.level)

module.exports = winston
