const { merge } = require('@nudj/library')
const variables = require('./variables')

module.exports.variables = variables

const breakpoints = {
  ns: `@media screen and (min-width: ${variables.breakpoints.notSmall})`,
  m: `@media screen and (min-width: ${variables.breakpoints.medium})`,
  l: `@media screen and (min-width: ${variables.breakpoints.large})`
}
module.exports.breakpoints = breakpoints

// Fonts
function createFontFamily (name, properties) {
  const fontFamily = name
  const src = `url('${variables.assets.fonts}${properties.files.eot}?#iefix') format('embedded-opentype'),
    url('${variables.assets.fonts}${properties.files.woff}') format('woff'),
    url('${variables.assets.fonts}${properties.files.woff2}') format('woff2'),
    url('${variables.assets.fonts}${properties.files.ttf}') format('truetype')`
  const fontStyle = `${properties.style}`
  const fontWeight = `${properties.weight}`

  return {fontFamily, fontStyle, fontWeight, src}
}

function createFont (name, font) {
  const fontFamilies = {}
  for (let variation in font) {
    const newName = `${name}-${variation}`
    fontFamilies[variation] = createFontFamily(newName, font[variation])
  }
  return fontFamilies
}

const fonts = {
  jan: createFont('jan', variables.fonts.jan)
}

const headings = {
  h1: {
    fontFamily: [fonts.jan.bold],
    fontSize: variables.fontSizes.f2,
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f1
    }
  },
  h2: {
    fontFamily: [fonts.jan.bold],
    fontSize: variables.fontSizes.f3,
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f2
    }
  },
  h3: {
    fontFamily: [fonts.jan.bold],
    fontSize: variables.fontSizes.f4,
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f3
    }
  },
  h4: {
    fontFamily: [fonts.jan.bold],
    fontSize: variables.fontSizes.f5,
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f4
    }
  },
  h4Light: {
    fontFamily: [fonts.jan.light],
    fontSize: variables.fontSizes.f5,
    fontWeight: 'normal',
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f4
    }
  },
  h5: {
    fontFamily: [fonts.jan.bold],
    fontSize: variables.fontSizes.f6,
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f5
    }
  },
  h6: {
    fontFamily: [fonts.jan.bold],
    fontSize: variables.fontSizes.f7,
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f6
    }
  },
  h7: {
    fontFamily: [fonts.jan.bold],
    fontSize: variables.fontSizes.f8,
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f7
    }
  },
  h8: {
    fontFamily: [fonts.jan.bold],
    fontSize: variables.fontSizes.f8,
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f8
    }
  },
  p: {
    fontFamily: [fonts.jan.light],
    fontSize: variables.fontSizes.f6,
    fontWeight: 'normal',
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f7
    }
  },
  p2: {
    fontFamily: [fonts.jan.light],
    fontSize: variables.fontSizes.f7,
    fontWeight: 'normal',
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f8
    }
  },
  small: {
    fontFamily: [fonts.jan.light],
    fontSize: variables.fontSizes.f9,
    fontWeight: 'normal',
    [breakpoints.ns]: {
      fontSize: variables.fontSizes.f9
    }
  }
}

headings.pBold = merge(headings.p, {
  fontFamily: [fonts.jan.bold],
  fontWeight: 'bold'
})

headings.p2Bold = merge(headings.p2, {
  fontFamily: [fonts.jan.bold],
  fontWeight: 'bold'
})

module.exports.headings = headings

module.exports.mainColor = variables.colors.pink
module.exports.mainColorFade = variables.colors.lightPink
module.exports.secondaryColor = variables.colors.royalBlue

module.exports.typography = {
  h1: merge({
    color: module.exports.mainColor,
    margin: `0 0 ${variables.padding.d} 0`
  }, headings.h1),
  h2: merge({
    color: module.exports.mainColor,
    margin: `0 0 ${variables.padding.d} 0`
  }, headings.h2),
  h3: merge({
    color: module.exports.mainColor,
    margin: `0 0 ${variables.padding.d} 0`
  }, headings.h3),
  h4: merge({
    color: module.exports.mainColor,
    margin: `0 0 ${variables.padding.d} 0`
  }, headings.h4),
  h5: merge({
    color: module.exports.mainColor,
    margin: `0 0 ${variables.padding.d} 0`
  }, headings.h5),
  p: merge({
    color: variables.colors.charcoal,
    margin: `0 0 ${variables.padding.d} 0`
  }, headings.p)
}

const linkImage = function (imagePath) {
  return `url('${variables.assets.images}${imagePath}')`
}

module.exports.linkImage = linkImage

module.exports.pageLayout = {
  pageBody: merge(headings.p, {
    background: variables.colors.grey,
    minHeight: '100vh'
  }),
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 0,
    background: variables.colors.white,
    padding: `${variables.padding.e} ${variables.padding.d}`
  },
  pageHeadline: merge(headings.h5, {
    color: module.exports.mainColor,
    padding: `${variables.padding.c} ${variables.padding.d} ${variables.padding.d} ${variables.padding.d}`,
    margin: 0
  }),
  pageContent: {
    flex: 1,
    padding: `0 0 ${variables.padding.c} 0`,
    display: 'flex'
  },
  pageMain: {
    flex: 1,
    padding: `0 ${variables.padding.d}`,
    minWidth: '520px'
  },
  pageSidebar: {
    boxSizing: 'content-box',
    display: 'none',
    padding: '0',
    position: 'relative',
    [breakpoints.m]: {
      display: 'block',
      width: variables.sizing.squishedSidebarWidth
    },
    [breakpoints.l]: {
      padding: `0 ${variables.padding.d} 0 calc(${variables.padding.c} + ${variables.padding.d})`,
      width: variables.sizing.sidebarWidth
    }
  },
  textHighlight: {
    color: module.exports.secondaryColor
  }
}

const cardStyle = {
  background: variables.colors.white,
  borderRadius: variables.sizing.baseBorderRadius,
  boxShadow: `${variables.sizing.genericBoxShadow} ${variables.colors.genericBoxShadow}`,
  padding: variables.padding.d
}

module.exports.cardStyle = cardStyle

module.exports.cardStyleTwo = merge(cardStyle, {
  background: variables.colors.offGrey,
  border: `${variables.sizing.baseBorderWidth} solid ${variables.colors.midGrey}`
})

module.exports.sansSerif = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "avenir next", avenir, "helvetica neue", helvetica, ubuntu, roboto, noto, "segoe ui", arial, sans-serif'
}

const dimHover = {
  backfaceVisibility: 'hidden',
  opacity: '.5',
  transition: 'opacity .15s ease-in'
}
module.exports.dim = {
  opacity: 1,
  transition: 'opacity .15s ease-in',
  ':hover': dimHover,
  ':focus': dimHover,
  ':active': {
    backfaceVisibility: 'hidden',
    opacity: '.8',
    transition: 'opacity .15s ease-out'
  }
}

const visited = {
  transition: 'color .15s ease-in'
}
module.exports.link = {
  textDecoration: 'none',
  transition: 'color .15s ease-in',
  ':link': visited,
  ':visited': visited,
  ':hover': {
    transition: 'color .15s ease-in'
  },
  ':focus': {
    transition: 'color .15s ease-in',
    outline: '1px dotted currentColor'
  }
}

const growHover = {
  transform: 'scale( 1.05 )'
}
module.exports.grow = {
  backfaceVisibility: 'hidden',
  transform: 'translateZ( 0 )',
  transition: 'transform .25s ease-out',
  ':hover': growHover,
  ':focus': growHover,
  ':active': {
    transform: 'transform: scale( .90 )'
  }
}

module.exports.deList = {
  listStyle: 'none',
  margin: '0',
  padding: '0'
}

module.exports.deLink = {
  color: 'inherit',
  textDecoration: 'none'
}

module.exports.button = merge(headings.pBold, {
  border: '0',
  borderRadius: variables.sizing.buttonBorderRadius,
  backgroundColor: module.exports.mainColor,
  color: variables.colors.white,
  cursor: 'pointer',
  display: 'block',
  padding: `${variables.padding.e} ${variables.padding.d}`,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  minWidth: variables.sizing.buttonMinWidth,
  textAlign: 'center',
  ':disabled': {
    backgroundColor: module.exports.mainColorFade,
    cursor: 'default'
  },
  ':focus': {
    outline: 'none'
  }
})

module.exports.buttonSecondary = merge(module.exports.button, {
  color: module.exports.mainColor,
  backgroundColor: variables.colors.white,
  border: `${variables.sizing.buttonBorderWidth} solid ${module.exports.mainColor}`,
  ':disabled': {
    color: module.exports.mainColorFade,
    borderColor: module.exports.mainColorFade,
    cursor: 'default'
  }
})

module.exports.buttonTertiary = merge(module.exports.button, {
  color: variables.colors.charcoal,
  backgroundColor: variables.colors.grey
})

module.exports.buttonClose = {
  backgroundColor: 'transparent',
  backgroundImage: linkImage('close-icon.svg'),
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  border: 'none',
  cursor: 'pointer',
  height: variables.padding.d,
  outline: 'none',
  position: 'absolute',
  right: variables.padding.e,
  top: variables.padding.e,
  width: variables.padding.d
}

const inputBoxReadonly = merge(headings.p, {
  border: `calc(${variables.sizing.baseBorderWidth} * 0.5) solid ${variables.colors.midGrey}`,
  borderRadius: `calc(${variables.sizing.baseBorderRadius} * 0.5)`,
  color: variables.colors.charcoal,
  outline: 'none',
  padding: variables.padding.e,
  [breakpoints.l]: {
    display: 'inline-block',
    width: '50%'
  },
  ':placeholder-shown': {
    color: variables.colors.midGrey
  },
  cursor: 'text'
})
const inputBox = merge(inputBoxReadonly, {
  ':focus': {
    borderColor: module.exports.mainColor,
    boxShadow: `${variables.sizing.genericBoxShadow} ${variables.colors.genericBoxShadow}`,
    color: module.exports.mainColor,
    outline: 'none'
  }
})
const removeInputBoxBorder = {
  border: '0',
  boxShadow: 'none',
  padding: `${variables.padding.e} ${variables.padding.e} ${variables.padding.e} 0`,
  ':focus': {
    border: '0',
    boxShadow: 'none'
  }
}
const inputBoxBorderless = merge(inputBox, removeInputBoxBorder)
const inputBoxReadonlyBorderless = merge(inputBoxReadonly, removeInputBoxBorder)

module.exports.formStructure = {
  formList: merge(module.exports.deList),
  formListItem: {
    margin: `0 0 ${variables.padding.d} 0`
  },
  formListItemHeading: merge(module.exports.pageLayout.pageHeadline, headings.h6, {
    margin: '0',
    padding: `${variables.padding.e} 0 0`
  }),
  formButtons: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end'
  }
}

module.exports.formElements = {
  label: merge(headings.h6, {
    color: module.exports.mainColor,
    display: 'block',
    padding: `0 0 ${variables.padding.e} 0`
  }),
  inputBox: inputBox,
  inputBoxReadonly: inputBoxReadonly,
  inputBoxUrl: merge(inputBox, {
    fontFamily: 'monospace'
  }),
  inputBoxBorderless: inputBoxBorderless,
  inputBoxReadonlyBorderless: inputBoxReadonlyBorderless,
  inputTextarea: merge(inputBox, {
    minHeight: variables.padding.a,
    [breakpoints.l]: {
      width: '80%'
    }
  }),
  selectBox: inputBox,
  submitButton: merge(module.exports.button, {
    [breakpoints.l]: {
      display: 'inline-block'
    }
  })
}

module.exports.formElements.errorLabel = merge(module.exports.formElements.label, {
  color: module.exports.mainColor,
  padding: `0 0 0 ${variables.padding.e}`,
  [breakpoints.l]: {
    display: 'inline-block'
  }
})

module.exports.sectionDivider = {
  backgroundColor: variables.colors.midGrey,
  border: 'none',
  color: variables.colors.midGrey,
  height: variables.sizing.baseBorderWidth,
  margin: `0 ${variables.padding.d} 0 ${variables.padding.d}`
}

const errorPageCopyLink = merge(module.exports.headings.p, {
  color: variables.colors.royalBlue,
  margin: '0',
  textDecoration: 'underline'
})

module.exports.errorPages = {
  body: {
    overflow: 'hidden',
    padding: `${variables.padding.d} ${variables.padding.d} ${variables.padding.c} ${variables.padding.d}`,
    '::before': {
      backgroundColor: 'transparent',
      backgroundImage: linkImage('nudj-logo-new.svg'),
      backgroundPosition: 'left top',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      content: `''`,
      display: 'block',
      height: '78px',
      maxWidth: variables.sizing.contentMaxWidth,
      margin: `0 auto ${variables.padding.c} auto`,
      pointerEvents: 'none',
      position: 'relative',
      width: '100%'
    }
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    padding: `0 0 200px 0`,
    position: 'relative',
    [breakpoints.m]: {
      margin: '0 auto',
      maxWidth: variables.sizing.contentMediumMaxWidth
    },
    '::after': {
      backgroundColor: 'transparent',
      backgroundImage: linkImage('thumbs-down.svg'),
      backgroundPosition: 'right center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      bottom: '0',
      content: `''`,
      display: 'block',
      height: '151px',
      left: '50%',
      pointerEvents: 'none',
      position: 'absolute',
      width: '689px'
    }
  },
  header: {
    position: 'relative'
  },
  title: merge(module.exports.typography.h1, {
    color: variables.colors.royalBlue,
    fontSize: '100px',
    [breakpoints.ns]: {
      fontSize: '160px'
    }
  }),
  copy: merge(module.exports.typography.p),
  pages: {
    padding: `0 0 ${variables.padding.d} 0`
  },
  copyLink: errorPageCopyLink,
  link: merge(errorPageCopyLink, {
    display: 'block',
    padding: `0 0 ${variables.padding.e} 0`,
    [breakpoints.l]: {
      display: 'inline-block',
      padding: variables.padding.e
    }
  })
}
