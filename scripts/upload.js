const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../.env` })
const axios = require('axios')
const flatten = require('flat')
const fs = require('fs')
const localizations = require(`${__dirname}/../helpers/localizations.js`)

const flattenedLocalizations = {}
Object.keys(localizations).forEach((language) => {
  flattenedLocalizations[language] = flatten(localizations[language])
})
;(async function postLocalizations() {
  console.log('==== Posting body:')
  console.log(JSON.stringify(flattenedLocalizations, undefined, 2))
  try {
    await axios.post(`https://localizer.borodutch.com/localizations`, {
      // await axios.post(`http://localhost:1337/localizations`, {
      localizations: flattenedLocalizations,
      password: process.env.PASSWORD,
      username: 'borodutch',
      tags: ['banofbot'],
    })
    console.error(`==== Body posted!`)
  } catch (err) {
    console.error(`==== Error posting: ${err.message}`)
  }
})()
