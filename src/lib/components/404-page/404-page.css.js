let {
  css,
  merge,
  mixins
} = require('../../lib/css')

module.exports = css({
  content: {
    padding: '8rem .5rem',
    textAlign: 'center',
    '@media screen and (min-width: 30em)': {
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }
  },
  header: {
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  copy: {
    fontSize: '1rem'
  },
  error: {
    fontStyle: 'italic',
    textTransform: 'uppercase',
    paddingTop: '.5rem',
    paddingBottom: '.5rem',
    color: '#555'
  },
  pages: {
    padding: '.5rem'
  },
  links: merge({
    display: 'inline-block',
    padding: '.5rem',
    color: '#ff725c',
    textDecoration: 'none'
  }, mixins.dim)
})
