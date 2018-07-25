/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const proxyquire = require('proxyquire')

const expect = chai.expect
chai.use(sinonChai)
chai.use(dirtyChai)

const requestGQLStub = sinon.stub()

const clickLogger = proxyquire('../../../lib/server/lib/click-logger', {
  '../../lib/requestGQL': requestGQLStub
})

describe('Click Logger', () => {
  let req
  let res
  const next = sinon.stub()

  beforeEach(() => {
    requestGQLStub.returns(Promise.resolve({}))
    req = {
      query: {
        m: 'abc123'
      }
    }
  })
  afterEach(() => {
    next.reset()
    requestGQLStub.reset()
  })

  it('should call `next()`', async () => {
    await clickLogger(req, res, next)
    expect(next).to.have.been.calledOnce()
  })

  it('should query the gql api for a new MessageEvent', async () => {
    await clickLogger(req, res, next)
    expect(requestGQLStub).to.have.been.called()
    expect(requestGQLStub.args[0]).to.deep.equal([null, `
      mutation createMessageEvent ($hash: String!) {
        createMessageEvent (hash: $hash) {
          id
        }
      }
    `, { hash: 'abc123' }])
  })

  describe('when `req.query.m` is not set', () => {
    beforeEach(() => {
      req = {
        query: {}
      }
    })

    it('should still call `next()`', async () => {
      await clickLogger(req, res, next)
      expect(next).to.have.been.calledOnce()
    })

    it('should not query the gql api', async () => {
      await clickLogger(req, res, next)
      expect(requestGQLStub).to.not.have.been.called()
    })
  })
})
