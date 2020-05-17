const texts = require('./localizations')

module.exports = () => ({
  translate: (key, language, ...theRest) => {
    let text = texts[key][language] || texts[key].en
    theRest.forEach((sub, i) => {
      text = text.replace(new RegExp(`\\$\\[${i + 1}\\]`, 'gum'), sub)
    })
    return text
  },
})
