let {
  css,
  mixins,
  merge,
  variables
} = require('../../lib/css')

module.exports = css({
  notification: {
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'center',
    width: variables.sizing.overlayDialogWidth,
    borderRadius: variables.sizing.baseBorderRadius,
    boxShadow: `${variables.sizing.genericBoxShadow} ${variables.colors.genericBoxShadow}`,
    backgroundColor: variables.colors.lightGrey,
    left: '50%',
    top: variables.sizing.notificationTop,
    transition: 'transform 300ms ease-in-out, opacity 300ms ease-in-out',
    transform: 'translateX(-50%) translateY(-200%)',
    opacity: 0,
    overflow: 'hidden',
    position: 'fixed',
    zIndex: 100
  },
  info: {
    backgroundColor: variables.colors.pink
  },
  warn: {
    backgroundColor: variables.colors.lightYellow
  },
  error: {
    backgroundColor: variables.colors.pink
  },
  success: {
    backgroundColor: variables.colors.green
  },
  message: merge(mixins.headings.p2, {
    flex: 1,
    padding: `${variables.padding.de} ${variables.padding.d}`,
    color: variables.colors.white
  }),
  close: {
    backgroundColor: variables.colors.genericLightShade,
    border: 0,
    display: 'block',
    cursor: 'pointer',
    color: variables.colors.white,
    alignSelf: 'stretch',
    padding: variables.padding.de,
    ':active': {
      outline: 'none',
      border: 'none'
    },
    ':focus': {
      outline: 'none',
      border: 'none'
    }
  },
  closeIcon: {
    display: 'block'
  },
  visible: {
    transform: 'translateX(-50%) translateY(-30%)',
    opacity: 1
  }
})
