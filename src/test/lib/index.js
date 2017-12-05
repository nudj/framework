/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const { AJAX_POSTFIX } = require('../../lib/lib/constants')
const {
  stripDelims,
  isAjax,
  addAjaxPostfix,
  removeAjaxPostfix
} = require('../../lib/lib')

describe('Library functions', () => {
  describe('stripDelims', () => {
    it('should remove two characters from a string either side', () => {
      const tag = '{{testing.win}}'
      expect(stripDelims(tag)).to.equal('testing.win')
    })
  })

  describe('isAjax', () => {
    it('should return true if url ends with "/json"', () => {
      const url = '/example/json'
      expect(isAjax(url)).to.be.true()
    })

    it('should return true if url contains "/json"', () => {
      const url = '/example/json/long/this/is/sparta'
      expect(isAjax(url)).to.be.true()
    })

    it('should return false if url does not contain "/json"', () => {
      const url = '/example/hello/test/sparta'
      expect(isAjax(url)).to.be.false()
    })
  })

  describe('addAjaxPostfix', () => {
    it('appends the AJAX_POSTFIX to the given url', () => {
      const url = '/hello'
      expect(addAjaxPostfix(url)).to.equal(url + AJAX_POSTFIX)
    })

    it('strips the url of trailing slashes', () => {
      const url = '/hello/there/'
      expect(addAjaxPostfix(url)).to.equal('/hello/there' + AJAX_POSTFIX)
    })

    it('appends AJAX_POSTFIX to url with query string', () => {
      const url = '/url/thing?cash=money'
      expect(addAjaxPostfix(url)).to.equal('/url/thing/json?cash=money')
    })
  })

  describe('removeAjaxPostfix', () => {
    it('removes "/json" from the url', () => {
      const url = '/my-favourite/json/url/for/testing'
      expect(removeAjaxPostfix(url)).to.equal('/my-favourite/url/for/testing')
    })

    it('leaves the url unaltered if "/json" is not present', () => {
      const url = '/my-favourite/url'
      expect(removeAjaxPostfix(url)).to.equal(url)
    })

    it('maintains the query string on the url', () => {
      const url = '/go/team/json?dogs=thebest'
      expect(removeAjaxPostfix(url)).to.equal('/go/team?dogs=thebest')
    })

    it('returns a base url if no url is passed', () => {
      expect(removeAjaxPostfix('')).to.equal('/')
    })
  })
})
