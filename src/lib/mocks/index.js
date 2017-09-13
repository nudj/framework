let mock = require('@nudj/api/mock')
let find = require('lodash/find')

module.exports = ({
  data
}) => {
  const addCustomHandlers = (server) => {
    server.get('/companies/:cid', (req, res, next) => {
      if (!req.params.cid.match(/^\d+$/)) {
        let company = find(data.companies, {
          slug: req.params.cid
        })
        if (company) {
          res.json(company)
        } else {
          res.json({
            error: true,
            code: 404,
            errorMessage: 'no match'
          })
        }
      } else {
        next()
      }
    })
    server.get('/jobs/:jid', (req, res, next) => {
      if (!req.params.jid.match(/^\d+$/)) {
        let job = find(data.jobs, {
          slug: req.params.jid
        })
        if (job) {
          res.json(job)
        } else {
          res.json({
            error: true,
            code: 404,
            errorMessage: 'no match'
          })
        }
      } else {
        next()
      }
    })
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

  return mock.gql({
    data,
    addCustomHandlers
  })
}
