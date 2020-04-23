import { fetchJsonFromUrlAsync } from '../modules/bcd-async.mjs'
import { forEachAsync } from '../modules/bcd-async.mjs'
import { getTableMetadata } from '../modules/bcd-statbank.mjs'
import { populateDropdownFromArray } from '../modules/bcd-ui.mjs'

(async () => {
  console.log('Statbank Tool')
  const STATBANK_BASE_URL =
          'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'

  const STATBANK_UNAVAILABLE_URL = 'https://statbank.cso.ie/webserviceclient/unavailableTables.aspx' // TODO- check against this
  const tableCodesArrayURI = '../data/tools/statbank/statbank_tablecodes.json'

  // fetch tableCodes for Statbank tables
  const tableCodes = await fetchJsonFromUrlAsync(tableCodesArrayURI)
  const tableCodesArray = tableCodes.map((d) => {
    return d.tablecode
  })

  const allMetadata = [] // TODO- remove gvar

  // document.getElementById('get-all-metadata')
  //   .addEventListener('click', async () => {
  //     console.log('Loading all metadata... \n')
  //
  //     const start = async () => {
  //       await forEachAsync(tableCodesArray, async (tableCode) => {
  //         try {
  //           const tableJson = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + tableCode)
  //           const tableMetadata = getTableMetadata(tableJson)
  //           tableMetadata.tablecode = tableCode // join
  //           console.log(tableMetadata)
  //           allMetadata.push(tableMetadata)
  //         } catch (e) {
  //           console.log('Error fetching metadata for table ' + tableCode)
  //           console.log(e)
  //         }
  //         console.log(allMetadata.length)
  //       })
  //       console.log('Done loading metadata')
  //       console.log(allMetadata)
  //     }
  //     start() // weird that I have to call this here, use IIFE?

    // tableCodesArray.forEach(async (tableCode) => {
    //   const tableJson = await fetchJsonFromUrl(STATBANK_BASE_URL + tableCode)
    //   allMetadata.push(getTableMetadata(tableJson))
    //   console.log(allMetadata.length)
    // })
    // let el = document.getElementById('statbank-loading')
    // el.textContent = 'Fetching data from statbank.cso.ie'
    // let elProgress = document.createElement('progress')
    // elProgress.setAttribute('max', '100')
    // elProgress.setAttribute('value', '50')
    // el.appendChild(elProgress)
    // }) // end of event listener

  const dropdown = document.getElementById('table-code-dropdown')

  populateDropdownFromArray(dropdown, tableCodesArray)

  dropdown.addEventListener('change', async (e) => {
    const tableCode = e.target.value
    console.log(`Loading ${tableCode}... \n`)
    // let el = document.getElementById('statbank-loading')
    // el.textContent = 'Fetching data from statbank.cso.ie'
    // let elProgress = document.createElement('progress')
    // elProgress.setAttribute('max', '100')
    // elProgress.setAttribute('value', '50')
    // el.appendChild(elProgress)
    try {
      const tableJson = await fetchJsonFromUrlAsync(STATBANK_BASE_URL + tableCode)
      console.log(getTableMetadata(tableJson))
    } catch (e) {
      console.log('Error fetching table ' + tableCode)
    }
  })

  // console.log('Got table')
  // console.log(table)

  // let fetchAsync = async () => {
  //   let tableO = await dropdown.addEventListener('change', async (e) => {
  //     console.log('select \n')
  //     const tableCode = e.target.value
  // //       //   // let el = document.getElementById('statbank-loading')
  //       //   // el.textContent = 'Fetching data from statbank.cso.ie'
  //       //   // let elProgress = document.createElement('progress')
  //       //   // elProgress.setAttribute('max', '100')
  //       //   // elProgress.setAttribute('value', '50')
  //       //   // el.appendChild(elProgress)
  //     let table1 = await fetchStatbankTableFromUrl(STATBANK_BASE_URL + tableCode)
  //     console.log('Got table')
  //     console.log(table1)
  //     return table1
  //   })
  //   return tableO
  // }

  // const waitTable = await fetchAsync()
  // console.log('waitTable')
  // console.log(waitTable)
})()

// let resource = fetchResource(tabletableCodes)
// console.log(resource.length)

// import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
// import { datalist } from 'https://unpkg.com/jsonstat-utils@2.5.5/export.mjs'
//
// import { populateDropdownFromArray } from './utils/bcd-ui.mjs'
// // import { fetchStatbankTableFromUrl } from './utils/bcd-statbank.mjs'
//
// const STATBANK_BASE_URL =
//         'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'
// // need to start with an array of objects with table codes
// // as Statbank doesn't have a discoverable list
// fetch('../data/statbank_table_tableCodes.json')
//     .then(response => response.json())
//     .then(tableCodes => {
//       console.log('No of tables:\n')
//       console.log(tableCodes.length)
//       let tableCodesArray = tableCodes.map((d) => {
//         return d.tablecode
//       })
//
//       let dropdown = document.getElementById('table-code-dropdown')
//       populateDropdownFromArray(dropdown, tableCodesArray)
//
//       // dropdown.addEventListener('change', (e) => {
//       // // console.log('select \n')
//       //   const tableCode = e.target.value
//       //   // let el = document.getElementById('statbank-loading')
//       //   // el.textContent = 'Fetching data from statbank.cso.ie'
//       //   // let elProgress = document.createElement('progress')
//       //   // elProgress.setAttribute('max', '100')
//       //   // elProgress.setAttribute('value', '50')
//       //   // el.appendChild(elProgress)
//       //   tableJson = fetchStatbankTableFromUrl(STATBANK_BASE_URL + tableCode)
//       // })
//     })
//
// const readKey = () => new Promise(resolve => window.addEventListener('keypress', resolve, { once: true }))
//
// let fetchStatbankTableFromUrl = async (url) => {
//   const res = await fetch(url)
//   const json = await res.json()
//   return json
// }
