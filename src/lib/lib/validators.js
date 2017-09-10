const some = require('lodash/some')
const filter = require('lodash/filter')
const isEmail = require('validator/lib/isEmail')
const { stripDelims } = require('.')

const tagRegex = /\{\{.*?\}\}/g
const permittedTags = [
  'recipient.firstname',
  'recipient.lastname',
  'job.title',
  'job.bonus',
  'job.link',
  'company.name',
  'sender.firstname',
  'sender.lastname'
]

const isNotOfType = (type) => (value) => typeof value !== type // eslint-disable-line valid-typeof
const hasNoLength = (value) => !value.length
const isNotEmailList = (value) => some(filter(value.replace(' ', '').split(','), (val) => val !== ''), (email) => !isEmail(email))
const containsUnpermittedTags = (value) => some(value.match(tagRegex), (tag) => !permittedTags.includes(stripDelims(tag)))

module.exports = {
  emails: {
    recipients: (value) => (
      isNotOfType('string')(value) ||
      hasNoLength(value) ||
      isNotEmailList(value)
    ) && 'Please enter at least one valid email',
    subject: (value) => (
      isNotOfType('string')(value) ||
      hasNoLength(value)
    ) && 'Please enter a subject',
    template: (value) => (
      isNotOfType('string')(value) ||
      hasNoLength(value) ||
      containsUnpermittedTags(value)
    ) && 'Please enter a message ensuring all tags are correct'
  }
}
