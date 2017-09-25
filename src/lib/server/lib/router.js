const express = require('express')
const path = require('path')

const { AJAX_POSTFIX } = require('../../lib/constants')

const methods = [
  'get',
  'post',
  'put',
  'patch',
  'delete'
]

const Router = () => {
  const router = express.Router()

  methods.forEach(method => {
    router[`${method}Handlers`] = (pattern, ...rest) => {
      router[`${method}`](pattern, ...rest)
      router[`${method}`](path.join(pattern, AJAX_POSTFIX), ...rest)
    }
  })

  return router
}

module.exports = Router
