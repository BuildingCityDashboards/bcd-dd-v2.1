import { fetchCsvFromUrlAsyncTimeout } from '../modules/bcd-async.js'

(async function main () {
  const uri = '/api/residentialpropertyprice'

  console.log('res property price')

  const csv = await fetchCsvFromUrlAsyncTimeout(uri)
  const json = d3.csvParse(csv)

  console.log(json)
})()
