let {
  css,
  mixins,
  merge,
  variables
} = require('../../lib/css')

module.exports = css({
  background: {
    alignItems: 'center',
    background: variables.colors.genericOverlayCover,
    cursor: 'pointer',
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    left: '0',
    position: 'fixed',
    top: '0',
    width: '100vw'
  },
  hidden: {
    display: 'none'
  },
  dialog: merge(mixins.cardStyle, {
    backgroundImage: mixins.linkImage('ok-hand.svg'),
    backgroundPosition: 'calc(100% - 30px) bottom',
    backgroundRepeat: 'no-repeat',
    cursor: 'auto',
    padding: `${variables.padding.c} ${variables.padding.c} ${variables.padding.b} ${variables.padding.c}`,
    position: 'relative',
    width: variables.sizing.overlayDialogWidth
  }),
  close: mixins.buttonClose
})
