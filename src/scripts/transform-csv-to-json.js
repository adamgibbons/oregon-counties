const path = require('path')
const csv = require('csvtojson')
const fs = require('fs')

const csvFilePath = path.resolve(__dirname, '../../data', 'awards-db.csv')
const destinationPath = path.resolve(__dirname, '../../data', 'awards-db.json')

async function execute () {
  return csv().fromFile(csvFilePath)
}

execute().then((array) => {
  fs.writeFileSync(destinationPath, JSON.stringify(array, null, 2))
})