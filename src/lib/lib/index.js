const { AJAX_POSTFIX } = require('../lib/constants')

// MOVE TO @nudj/library
const stripDelims = (tag) => tag.slice(2, -2)

const isAjax = (url) => url.includes('/json')
const addAjaxPostfix = (url) => {
  let newUrl = ''
  const [pathname, search] = url.split('?')

  if (pathname.endsWith('/')) {
    newUrl = pathname.slice(0, -1)
  } else {
    newUrl = pathname
  }

  newUrl = `${newUrl}${AJAX_POSTFIX}`

  if (search) {
    newUrl = `${newUrl}?${search}`
  }

  return newUrl
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
