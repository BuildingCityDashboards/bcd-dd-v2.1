import { fetchCsvFromUrlAsyncTimeout } from '../modules/bcd-async.js'

(async function main () {
  const uri = '/api/residentialpropertyprice '

  console.log('res property price')

  const json = await fetchCsvFromUrlAsyncTimeout(uri)
  console.log(json)
})()
