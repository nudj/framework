const getMockApiApps = require('@nudj/api/mock')
const find = require('lodash/find')
const rewrite = require('express-urlrewrite')

module.exports = ({ data }) => {
  const addCustomHandlers = server => {
    server.get('/:type/filter', rewrite('/:type'))
    server.get('/:type/first', (req, res, next) => {
      let type = req.params.type
      let match = find(data[type], req.query)
      if (match) {
        res.json(match)
      } else {
        res.json({
          error: true,
          code: 404,
          errorMessage: 'no match'
        })
      }
    })
    return server
  }

  return getMockApiApps({
    data,
    addCustomHandlers
  })
}
