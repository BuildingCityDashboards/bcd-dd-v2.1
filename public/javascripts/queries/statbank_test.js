import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { datalist } from 'https://unpkg.com/jsonstat-utils@2.5.5/export.mjs'

const STATBANK_BASE_URL =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'

fetch('../data/statbank_table_codes.json')
  .then(response => response.json())
  .then(data => {
    console.log('No of tables:\n')
    console.log(data.length)
    const ri = Math.floor(Math.random() * data.length)
    console.log('Random table:\n')
    console.log(data[ri])
    const tableCode = data[ri].tablecode
    getStatbankTableFromUrl(STATBANK_BASE_URL + tableCode)
  })

let getStatbankTableFromUrl = async (url) => {
  const res = await fetch(url)
  const json = await res.json()

  /** *
  JSON-stat Javascript Toolkit (JJK)
  ***/
  const stat = JSONstat(JSON.parse(JSON.stringify(json)))
  console.log(stat.Dataset(0).value.length)
  console.log(stat.Dataset(0).source)
  console.log(stat.Dataset(0).updated)
  console.log(stat.Dataset(0).id)
  console.log(stat.Dataset(0))
  // const label = stat.Dataset(0).Dimension(0).Category('IE21').label
  // console.log(label)

  // filter with Splice() and a filter object
  const subset = JSONstat(json).Dataset(0).Slice(
        { 'NUTS 3 Regions': 'IE21' } // select Dublin
      )
  console.log('subset\n')
  console.log(subset.value.length)
  console.log(stat.Dataset(0).value.length)

  // flatten with toTable and a filter function
  // returns an array of objects with key/value pairs
  const table = stat.Dataset(0).toTable(
       { type: 'arrobj', category: 'value'},
       function (d) {
         if (d['NUTS 3 Regions'] === 'Dublin') {
           return { year: d.Year, value: d.value * 1000 }
         }
       }
    )
  console.log(table)

  /***
  JSON-stat Javascript Utilities Suite
  ***/
  // pass in json or JSONstat - performance?
  const dataListHtml = datalist(subset, {
    counter: false,
    tblclass: 'datalist',
      // numclass: 'number'
      // valclass: 'value'
    vlabel: 'Thousands'
  })

  document.getElementById('statbank-test-datalist').innerHTML = dataListHtml
}

