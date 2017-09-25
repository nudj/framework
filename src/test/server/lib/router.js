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
    expressRouter = {
      get: sinon.stub()
    }
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
          expect(router.getHandlers).to.be.a('function')
        })

        it('should call express router.get', () => {
          router.getHandlers('/some/path', 'someHandler')
          expect(expressRouter.get).to.have.been.called()
        })

        it('should call express router.get twice', () => {
          router.getHandlers('/some/path', 'someHandler')
          expect(expressRouter.get).to.have.been.calledTwice()
        })

        it('should call express router.get with html params', () => {
          router.getHandlers('/some/path', 'someHandler')
          expect(expressRouter.get).to.have.been.calledWith('/some/path', 'someHandler')
        })

        it('should call express router.get with data params', () => {
          router.getHandlers('/some/path', 'someHandler')
          expect(expressRouter.get).to.have.been.calledWith('/some/path/json', 'someHandler')
        })
      })
    })
  })
})
