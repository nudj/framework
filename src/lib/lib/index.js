const { AJAX_POSTFIX } = require('../lib/constants')

// MOVE TO @nudj/library
const stripDelims = (tag) => tag.slice(2, -2)

const isAjax = (url) => url.includes('/json')
const addAjaxPostfix = (url) => {
  if (url.endsWith('/')) {
    url = url.slice(0, -1)
  }
  if (url.includes('?')) {
    url = url.split('?')
    return `${url[0]}${AJAX_POSTFIX}?${url[1]}`
  }
  return `${url}${AJAX_POSTFIX}`
}
const removeAjaxPostfix = (url) => {
  url = isAjax(url) ? url.replace('/json', '') : url
  return url || '/'
}

module.exports = {
  stripDelims,
  isAjax,
  addAjaxPostfix,
  removeAjaxPostfix
}
