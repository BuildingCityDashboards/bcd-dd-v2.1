// Load boundaries
let url_peb06 =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/PEB06'
import { datalist } from 'https://unpkg.com/jsonstat-utils@2.5.5/export.mjs'

let main = async function (url) {
  const res = await fetch(url)
  const json = await res.json()
  document.getElementById('statbank-test-datalist').innerHTML = datalist(json, {
    counter: false,
    tblclass: 'datalist'
    // numclass: 'number'
    // valclass: 'value'
    // vlabel: 'value'
  })
}
main(url_peb06)

