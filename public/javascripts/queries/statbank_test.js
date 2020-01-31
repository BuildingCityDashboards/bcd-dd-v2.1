// Load boundaries
let url_peb06 =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/PEB06'
// import { JSONstat } from 'https://unpkg.com/jsonstat@0.13.13/export.mjs'
import JSONstat from "https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs";
// import { datalist } from 'https://unpkg.com/jsonstat-utils@2.5.5/export.mjs'

JSONstat("https://json-stat.org/samples/galicia.json",
  function(){
    console.log("got it");
    let subset=JSONstat( this ).Slice(
        //Flatten dimensions "birth", "age", "time":
        //Keep only
        //category "T" of dimension "birth"
        //category "T" of dimension "age"
        //category "2011" of dimension "time"
        { "birth": "T", "age": "T", "time": "2011" }
      )
    ;
    console.log("subset\n");
    console.log(subset)
  }
);

    // or https://cdn.jsdelivr.net/npm/jsonstat@0.13.13/export.mjs
// jsonstat
// let main = async (url) => {
//   const res = await fetch(url)
//   const json = await res.json()
//
//   // JSON-stat Javascript
//   const stat = JSONstat(json)
//
//   console.log(stat.Dataset(0).source)
//   console.log(stat.Dataset(0).updated)
//   console.log(stat.Dataset(0).id)
//   // console.log(stat.Dataset(0).value)
//
//   // const table = stat.Dataset(0).toTable(
//   //    { type: 'arrobj'},
//   //    function (d, i) {
//   //      if (d['NUTS 3 Regions'] === 'Dublin') {
//   //        return { year: d.Year, value: d.value * 1000 }
//   //      }
//   //    }
//   // )
//   // console.log(table)
//
//   // Flatten
//   console.log(stat.length)
//   let options = { "time": "2011" }
//   let subset = stat.Slice( { "birth": "T", "age": "T", "time": "2011" } )
//
//   // console.log("subset\n");
//   // console.log(subset.length)
//
//
//
//
//   // JSON-stat Javascript Utilities Suite
//   // pass in json or JSONstat - performance?
//   // const dataListHtml = datalist(subset, {
//   //   counter: false,
//   //   tblclass: 'datalist'
//   //   // numclass: 'number'
//   //   // valclass: 'value'
//   //   // vlabel: 'value'
//   // })
//   //
//   // document.getElementById('statbank-test-datalist').innerHTML = dataListHtml
// }
//
// main(url_peb06)
