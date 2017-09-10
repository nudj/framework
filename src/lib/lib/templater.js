// MOVE TO @nudj/library

const get = require('lodash/get')
const identity = require('lodash/identity')
const { stripDelims } = require('.')

const applyTags = (para, data, tagify, chunkify, indexStart) => {
  let tags = para.match(/\{\{.*?\}\}/g) || []
  let order = para.match(/\{\{.*?\}\}|((?!(\{\{.*?\}\}))[^])+/g) || []
  let chunks = order.map((chunk, index) => {
    if (tags.includes(chunk)) {
      let value = get(data, stripDelims(chunk))
      return tagify(value !== undefined ? value : chunk, value !== undefined, indexStart + index)
    } else {
      return chunkify(chunk, indexStart + index)
    }
  })
  return chunks
}

module.exports.render = ({
  template,
  data,
  tagify = identity,
  pify = identity,
  chunkify = identity,
  brify = () => '<br />',
  splitter = '\n'
}) => {
  let lines = template.split(splitter)
  let paras = []
  let i = 0
  while (lines[i] !== undefined) {
    let padding = 0
    let para = []
    while (lines[i] !== undefined && !lines[i].length) {
      padding++
      i++
    }
    let chunkCount = 0
    while (lines[i] !== undefined && lines[i].length) {
      let chunks = applyTags(lines[i], data, tagify, chunkify, chunkCount)
      if (para.length) {
        para = para.concat(brify(chunkCount), chunks)
        chunkCount += chunks.length + 1
      } else {
        para = para.concat(chunks)
        chunkCount += chunks.length
      }
      i++
    }
    paras.push(pify(para, paras.length, padding))
  }
  return paras
}
