let {
  css,
  merge,
  mixins
} = require('../../lib/css')

module.exports = css({
  content: {
    textAlign: 'center',
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  header: {
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  copy: {
    fontSize: '1rem',
    paddingTop: '.5rem'
  },
  error: {
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: '#555'
  },
  link: merge({
    color: '#ff725c',
    textDecoration: 'none'
  }, mixins.dim)
})
