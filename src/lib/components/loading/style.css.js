const { css, variables } = require('../../lib/css')

const spin = {
  '0%': {
    transform: 'scale(0)'
  },
  '100%': {
    transform: 'scale(1.0)',
    opacity: 0
  }
}

module.exports = css({
  loading: {
    background: variables.colors.white
  },
  body: {
    flex: '1 1 auto',
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinner: {
    width: variables.padding.c,
    height: variables.padding.c,
    backgroundColor: variables.colors.navy,
    borderRadius: '100%',
    animationName: spin,
    animationDuration: '1.0s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out'
  }
})
