const requestGQL = require('../../lib/requestGQL')

const clickLogger = async (req, res, next) => {
  if (req.query && req.query.m) {
    const gql = `
      mutation createMessageEvent ($hash: String!) {
        createMessageEvent (hash: $hash) {
          id
        }
      }
    `
    const variables = {
      hash: req.query.m
    }

    // no need to await
    requestGQL(null, gql, variables)
      .catch(error => console.error(error))
  }
  next()
}

module.exports = clickLogger
