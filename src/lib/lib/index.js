const { AJAX_POSTFIX } = require('../lib/constants')

// MOVE TO @nudj/library
const stripDelims = (tag) => tag.slice(2, -2)

const isAjax = (url) => url.endsWith('/json')
const addAjaxPostfix = (url) => {
  if (url.endsWith('/')) {
    url = url.slice(0, -1)
  }
  return `${url}${AJAX_POSTFIX}`
}
const removeAjaxPostfix = (url) => {
  url = isAjax(url) ? url.slice(0, -5) : url
  return url || '/'
}

module.exports = {
  stripDelims,
  isAjax,
  addAjaxPostfix,
  removeAjaxPostfix
}
