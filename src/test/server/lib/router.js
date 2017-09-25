/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const express = require('express')

const expect = chai.expect
const methods = [
  'get',
  'post',
  'put',
  'patch',
  'delete'
]
chai.use(sinonChai)
chai.use(dirtyChai)

describe('Router', () => {
  let Router
  let expressRouter
  let expressRouterStub

  before(() => {
    Router = require('../../../lib/server/lib/router')
    expressRouterStub = sinon.stub(express, 'Router')
  })
  beforeEach(() => {
    expressRouter = methods.reduce((expressRouter, method) => {
      expressRouter[method] = sinon.stub()
      return expressRouter
    }, {})
    expressRouterStub.returns(expressRouter)
  })
  afterEach(() => {
    expressRouterStub.reset()
  })

  it('should be a function', () => {
    expect(Router).to.be.a('function')
  })

  describe('when instantiated', () => {
    let router

    beforeEach(() => {
      router = Router()
    })

    methods.forEach(method => {
      describe(`the ${method}Handlers method`, () => {
        it('should exist', () => {
          expect(router).to.have.property(`${method}Handlers`)
        })

        it('should be a function', () => {
          expect(router[`${method}Handlers`]).to.be.a('function')
        })

        it(`should call express router.${method}`, () => {
          router[`${method}Handlers`]('/some/path', 'someHandler')
          expect(expressRouter[method]).to.have.been.called()
        })

        it(`should call express router.${method} twice`, () => {
          router[`${method}Handlers`]('/some/path', 'someHandler')
          expect(expressRouter[method]).to.have.been.calledTwice()
        })

        it(`should call express router.${method} with html params`, () => {
          router[`${method}Handlers`]('/some/path', 'someHandler')
          expect(expressRouter[method]).to.have.been.calledWith('/some/path', 'someHandler')
        })

        it(`should call express router.${method} with data params`, () => {
          router[`${method}Handlers`]('/some/path', 'someHandler')
          expect(expressRouter[method]).to.have.been.calledWith('/some/path/json', 'someHandler')
        })
      })
    })
  })
})
