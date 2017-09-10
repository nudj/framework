module.exports.assets = {
  fonts: '/assets/fonts/',
  images: '/assets/images/'
}

module.exports.breakpoints = {
  notSmall: '30em',
  medium: '45em',
  large: '60em'
}

const basePixelSize = 20

module.exports.sizing = {
  basePadding: `${basePixelSize}px`,
  baseBorderRadius: '4px',
  baseBorderWidth: '2px',
  buttonBorderRadius: '9999px',
  buttonBorderWidth: '2px',
  detailSeparatorWidth: '1px',
  fixedHeaderWidth: `${basePixelSize * 6}px`,
  fixedHeaderButtonSize: `${basePixelSize * 3.5}px`,
  fixedHeaderButtonIconSize: `${basePixelSize * 1.5}px`,
  genericBoxShadow: '0 0.5px 0.5px 0',
  overlayDialogWidth: '500px',
  sidebarWidth: '285px',
  squishedSidebarWidth: '160px',
  notificationTop: `${basePixelSize * 1.5}px`,
  textEditorLineHeight: '1.5rem',
  buttonMinWidth: '120px'
}

module.exports.padding = {
  a: `${basePixelSize * 8}px`,
  b: `${basePixelSize * 4}px`,
  c: `${basePixelSize * 2}px`,
  d: `${basePixelSize}px`,
  de: `${basePixelSize * 0.75}px`,
  e: `${basePixelSize * 0.5}px`,
  f: `${basePixelSize * 0.25}px`
}

module.exports.colors = {
  beige: '#efebd3',
  charcoal: '#2d2926',
  charcoalTint2: '#817f7d',
  darkPink: '#8f3a49',
  pink: '#ef6079',
  grey: '#ececeb',
  lightGrey: '#d0d0ce',
  lighterGrey: '#f7f7f6',
  lightYellow: '#f7ea48',
  midRed: '#e35205',
  midGrey: '#ced2d5',
  navy: '#081f2c',
  navyBlue: '#002051',
  royalBlue: '#002d72',
  royalBlueFade: '#6681aa',
  lightPink: '#f5a0af',
  white: '#fff',
  offWhite: '#fafafa',
  offGrey: '#f6f6f5',
  green: '#7ac74f',
  //
  genericBoxShadow: 'rgba(0, 0, 0, 0.1)',
  genericOverlayCover: 'rgba(45, 41, 38, 0.4)',
  genericLightShade: 'rgba(45, 41, 38, 0.2)',
  royalBlueShade: 'rgba(77, 108, 157, 0.1)'
}

module.exports.fonts = {
  jan: {
    'light': {
      files: {
        eot: 'F37Jan-Light.eot',
        ttf: 'F37Jan-Light.ttf',
        woff: 'F37Jan-Light.woff',
        woff2: 'F37Jan-Light.woff2'
      },
      style: 'normal',
      weight: '200'
    },
    'lightItalic': {
      files: {
        eot: 'F37Jan-LightItalic.eot',
        ttf: 'F37Jan-LightItalic.ttf',
        woff: 'F37Jan-LightItalic.woff',
        woff2: 'F37Jan-LightItalic.woff2'
      },
      style: 'italic',
      weight: '200'
    },
    'regular': {
      files: {
        eot: 'F37Jan-Regular.eot',
        ttf: 'F37Jan-Regular.ttf',
        woff: 'F37Jan-Regular.woff',
        woff2: 'F37Jan-Regular.woff2'
      },
      style: 'normal',
      weight: '400'
    },
    'regularItalic': {
      files: {
        eot: 'F37Jan-RegularItalic.eot',
        ttf: 'F37Jan-RegularItalic.ttf',
        woff: 'F37Jan-RegularItalic.woff',
        woff2: 'F37Jan-RegularItalic.woff2'
      },
      style: 'italic',
      weight: '400'
    },
    'bold': {
      files: {
        eot: 'F37Jan-Bold.eot',
        ttf: 'F37Jan-Bold.ttf',
        woff: 'F37Jan-Bold.woff',
        woff2: 'F37Jan-Bold.woff2'
      },
      style: 'normal',
      weight: '700'
    },
    'boldItalic': {
      files: {
        eot: 'F37Jan-BoldItalic.eot',
        ttf: 'F37Jan-BoldItalic.ttf',
        woff: 'F37Jan-BoldItalic.woff',
        woff2: 'F37Jan-BoldItalic.woff2'
      },
      style: 'italic',
      weight: '700'
    }
  }
}

module.exports.fontSizes = {
  f1: '46px',
  f2: '42px',
  f3: '30px',
  f4: '26px',
  f5: '24px',
  f6: '18px',
  f7: '16px',
  f8: '14px',
  f9: '12px'
}

module.exports.zIndicies = {
  tooltip: '900'
}
