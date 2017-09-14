const extensions = []

// Take the supplied selector and apply it as the ancestor selector
// if it starts with the ^ caret character, eg:
//
// {
//   randomSelector: {
//     ^.randomAncestor: {
//       color: 'blue'
//     }
//   }
// }
//
// (`randomSelector` will have a random suffix applied to it and end up
// with a name like `randomSelector_4a5b6c`) the final output will be:
//
// .randomAncestor .randomSelector_4a5b6c {
//   color: 'blue'
// }
//
function ancestorSelectorHandler (selector, baseSelector, generateSubtreeStyles) {
  const pattern = (/^\^([.#-A-Za-z0-9]+)/)
  const matches = selector.match(pattern)

  if (!matches) {
    return null
  }

  const newSelector = `${matches[1]} ${baseSelector}`
  return generateSubtreeStyles(newSelector)
}

const globalExtension = {selectorHandler: ancestorSelectorHandler}
extensions.push(globalExtension)

module.exports = extensions
