import { fetchCsvFromUrlAsyncTimeout, fetchJsonFromUrlAsyncTimeout } from '../modules/bcd-async.js'
import { getDateFromCommonString } from '../modules/bcd-date.js'
import { getDefaultMapOptions, getDublinLatLng } from '../modules/bcd-maps.js'

import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../modules/bcd-ui.js'
import { getTraceDefaults, getLayoutDefaults } from '../modules/bcd-plotly-utils.js'

// import { TimeoutError } from '../modules/TimeoutError.js's

const dublinPostcodes =
['Dublin 1', 'Dublin 2', 'Dublin 3', 'Dublin 4', 'Dublin 5', 'Dublin 6', 'Dublin 7', 'Dublin 6W', 'Dublin 9', 'Dublin 8', 'Dublin 11', 'Dublin 10', 'Dublin 13', 'Dublin 12', 'Dublin 15', 'Dublin 14', 'Dublin 17', 'Dublin 16', 'Dublin 18', 'Dublin 20', 'Dublin 22', 'Dublin 24', '']

async function main (options) {
  const chartId = 'chart-property-price'
  const mapId = 'map-property-price'
  initialiseMap(mapId)
  addPostcodesToMap(mapId)

  const timeSelectorOptions = {
    buttons: [{
      step: 'month',
      stepmode: 'backward',
      count: 1,
      label: '1m'
    }, {
      step: 'month',
      stepmode: 'backward',
      count: 6,
      label: '6m'
    }, {
      step: 'year',
      stepmode: 'todate',
      count: 1,
      label: 'YTD'
    }, {
      step: 'year',
      stepmode: 'backward',
      count: 1,
      label: '1y'
    }, {
      step: 'year',
      stepmode: 'backward',
      count: 5,
      label: '5y'
    }, {
      step: 'year',
      stepmode: 'backward',
      count: 10,
      label: '10y'
    }, {
      step: 'all'
    }]
  }

  const valueRange = {
    min: 50000,
    max: 1000000
  }

  const postcodeButtons = dublinPostcodes.map((p) => {
    return {
      method: 'restyle',
      args: ['visible', dublinPostcodes.map(pc => {
        return p === pc
      })],
      label: p || 'Not Given'
    }
  })

  const layoutInitial = {
    title: 'Property Price Query',
    uirevision: 'true',
    xaxis: {
      rangeselector: timeSelectorOptions,
      // rangeslider: {}
      range: [new Date(2020, 0, 1), new Date()]
    },
    yaxis: {
      fixedrange: false,
      range: [valueRange.min, valueRange.max]
    },
    updatemenus: [{
      y: 1,
      yanchor: 'top',
      buttons: postcodeButtons
    }]
  }
  // console.log(layoutInitial)

  const pprLayout = Object.assign(getLayoutDefaults('scatter'), layoutInitial)
  // console.log(pprLayout)

  const pprPlot = document.getElementById(chartId)

  // Initialise a blank plot
  Plotly.newPlot(chartId, [], pprLayout, {})

  // fetch data and draw plot traces
  try {
    // const API_REQ = '/api/residentialpropertyprice/'

    // scatterplot of individual house sales from PPR
    const ppr2020 = await getPPRTracesForYear(2020)
    ppr2020[0].visible = true
    Plotly.addTraces(chartId, ppr2020)
    const chart = document.getElementById(chartId)

    // line plot of CSO trend data for house price
    const trendDataset = await getTrendDataset()
    const trends2020 = await getTrendTracesForYear(trendDataset, 2020)
    trends2020[0].visible = true
    Plotly.addTraces(chartId, trends2020)

    // TODO: handle this state better
    let currentDropdownSelectedIndex = 0

    pprPlot.on('plotly_click', function (data) {
      let pts = ''
      let d = {}
      for (let i = 0; i < data.points.length; i++) {
        pts = 'x = ' + data.points[i].x + '\ny = ' +
            data.points[i].y + '\n\n'
        d = data.points[i].customdata
      }
      console.log('Closest point clicked:\n\n' + pts)
      console.log(d)
    })

    // listens for time selector events
    pprPlot.on('plotly_relayout', async function (event) {
      console.log(event)

      const graphDiv = document.getElementById(chartId)
      console.log(graphDiv.data.length)
      if (arguments[0]['xaxis.range[0]'] != null) {
        const startYear = new Date(arguments[0]['xaxis.range[0]']).getFullYear()
        // let yearsPlotted = graphDiv.data.map(d => {
        //   return d.name
        // })
        for (let yr = +startYear; yr < 2020; yr += 1) {
          // console.log(yearsPlotted) // => returns the number of traces
          // if (!yearsPlotted.includes('ppr-' + yr + '-' + d.replace(' ', '-'))) {

          // TODO: data is packed in function and unpacked here, so improve for perf
          const traces = await getPPRTracesForYear(yr)
          if (traces != null) {
            const xs = []
            const ys = []
            const cs = []
            const is = []
            // console.log(graphDiv.data)
            traces.forEach((trace, i) => {
              // console.log(trace)
              xs.push(trace.x)
              ys.push(trace.y)
              cs.push(trace.customdata)
              is.push(i)
            })
            Plotly.extendTraces(chartId, { x: xs, y: ys, customdata: cs }, is)
          }
          // Plotly.extendTraces(chartId, { x: [trace.x], y: [trace.y] }, [0])
          // console.log('add trace')
        }
        const trends = await getTrendTracesForYear(trendDataset, startYear)
        trends[currentDropdownSelectedIndex].visible = true
        if (trends != null) {
          const trendis = trends.map((trend, i) => {
            return i + 23
          })
          Plotly.deleteTraces(graphDiv, trendis)
          Plotly.addTraces(chartId, trends)
        }
      }
    })

    // listens for dropdown menu events
    pprPlot.on('plotly_restyle', (e) => {
      // console.log('restyle')
      currentDropdownSelectedIndex = e[0].visible.indexOf(true)
    })
  } catch (e) {
    console.log('Error creating Property Price query chart')
    console.log(e)
  //   removeSpinner(chartDivIds[0])
  //   const eMsg = e instanceof TimeoutError ? e : 'An error occured'
  //   const errBtnID = addErrorMessageButton(chartDivIds[0], eMsg)
  //   // console.log(errBtnID)
  //   d3.select(`#${errBtnID}`).on('click', function () {
  //     removeErrorMessageButton(chartDivIds[0])
  //     main()
  //   })
  }
}

export { main }

async function getPPRTracesForYear (year) {
  try {
    const pprCSV = await fetchCsvFromUrlAsyncTimeout(`../data/Housing/PPR/PPR-${year}-Dublin.csv`)
    // console.log(pprCSV)
    const pprJSON = d3.csvParse(pprCSV)
    // console.log(pprJSON)
    const pprDates = {} // x-axis data indexed by postcode
    const pprValues = {} // y-axis data indexed by postcode
    const pprCustomData = {}
    pprJSON.forEach(d => {
      // if (d['Postal Code'] === 'Dublin 1') { // && v > valueRange.min && v < valueRange.max) {

      if (!pprDates[`${d['Postal Code']}`]) {
        pprDates[`${d['Postal Code']}`] = []
      }
      //  Plotly accepts dates in the format YYY-MM-DD and DD/MM/YYYY
      pprDates[`${d['Postal Code']}`].push(getDateFromCommonString(d['Date of Sale (dd/mm/yyyy)']))
      // pprCustomData.push(d)
      if (!pprValues[`${d['Postal Code']}`]) {
        pprValues[`${d['Postal Code']}`] = []
      }
      const v = parseInt(d['Price (�)'].replace(/[�,]/g, ''))
      pprValues[`${d['Postal Code']}`].push(v)

      if (!pprCustomData[`${d['Postal Code']}`]) {
        pprCustomData[`${d['Postal Code']}`] = []
      }
      pprCustomData[`${d['Postal Code']}`].push(d)
      // console.log('>'+d['Postal Code']+'<')
      // console.log(v)
      // }
    })

    // console.log(pprDates)
    // console.log(pprValues)
    // console.log(dublinPostcodes)
    const pprTraces = dublinPostcodes.map(d => {
      // console.log(d)
      // console.log(pprValues[d]);
      const pprTraceData = {
        x: pprDates[d] || [],
        y: pprValues[d] || [],
        customdata: pprCustomData[d] || []
      }
      const pprTrace = Object.assign(pprTraceData, getTraceDefaults('scatter'))
      pprTrace.name = 'ppr-' + year + '-' + d.replace(' ', '-')
      // console.log(pprTraceData);
      return pprTraceData
    })

    // console.log(pprTraces)
    // const pprTraces = [pprTrace]
    return pprTraces
  } catch (e) {
    return null
  }
}

async function getTrendDataset () {
  // const STATBANK_BASE_URL =
  //   'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/'

  const STATIC_URL = '../data/statbank/HPM04.json'
  // // HPM05: Market-based Household Purchases of Residential Dwellings by Type of Dwelling, Dwelling Status, Stamp Duty Event, RPPI Region, Month and Statistic
  // const TABLE_CODE = 'HPM04' // gives no of outsideState and ave household size

  //   addSpinner(chartDivIds[0], `<b>statbank.cso.ie</b> for table <b>${TABLE_CODE}</b>: <i>Market-based Household Purchases of Residential Dwellings</i>`)
  const json = await fetchJsonFromUrlAsyncTimeout(STATIC_URL)
  //   if (json) {
  //     removeSpinner(chartDivIds[0])
  //   }

  return JSONstat(json).Dataset(0)
}

async function getTrendTracesForYear (dataset, year) {
  const parseYearMonth = d3.timeParse('%YM%m') // ie 2014-Jan = Wed Jan 01 2014 00:00:00
  const dimensions = dataset.Dimension().map(dim => {
    return dim.label
  })

  const categoriesDwelling = dataset.Dimension(dimensions[0]).Category().map(c => {
    return c.label
  })

  const categoriesEircode = dataset.Dimension(dimensions[1]).Category().map(c => {
    return c.label
  })

  const categoriesStamp = dataset.Dimension(dimensions[2]).Category().map(c => {
    return c.label
  })
  // console.log(categoriesStamp)

  const categoriesBuyer = dataset.Dimension(dimensions[3]).Category().map(c => {
    return c.label
  })

  const categoriesStat = dataset.Dimension(dimensions[5]).Category().map(c => {
    return c.label
  })

  const eircodesDublin = categoriesEircode.filter(d => {
    return d.includes('Dublin')
  }).map(d => {
    return d.split(': ')[1]
  })

  // console.log(eircodesDublin)

  const ppTrend = dataset.toTable(
    { type: 'arrobj' },
    (d, i) => {
      d.date = parseYearMonth(d.Month)
      d.year = d.date.getFullYear()
      if (d[dimensions[0]] === categoriesDwelling[0] &&
          d[dimensions[1]].includes('Dublin') &&
          d[dimensions[2]] === categoriesStamp[1] && // use exectuions for month of property transfer
          d[dimensions[3]] === categoriesBuyer[0] &&
          d[dimensions[5]] === categoriesStat[2] &&
          d.year >= year) {
        d.label = d.Month
        d.value = +d.value
        return d
      }
    })

  // console.log(ppTrend)

  const ppTrendDates = {}
  const ppTrendVals = {}
  const ppTrendCustomData = {}

  ppTrend.forEach(d => {
    const eircodeKey = `${d['Eircode Output'].split(': ')[1]}`
    // console.log(eircodeKey);
    if (!ppTrendDates[eircodeKey]) {
      ppTrendDates[eircodeKey] = []
    }
    ppTrendDates[eircodeKey].push(d.date)
    // pprCustomData.push(d)
    if (!ppTrendVals[eircodeKey]) {
      ppTrendVals[eircodeKey] = []
    }
    ppTrendVals[eircodeKey].push(d.value)

    if (!ppTrendCustomData[eircodeKey]) {
      ppTrendCustomData[eircodeKey] = []
    }
    ppTrendCustomData[eircodeKey].push(d)
    // console.log('>'+d['Postal Code']+'<')
    // console.log(v)
    // }
  })

  // console.log(ppTrendDates)

  const trendTraces = eircodesDublin.map(d => {
    // console.log(d)
    // console.log(pprValues[d]);
    const pprTrendData = {
      x: ppTrendDates[d] || [],
      y: ppTrendVals[d] || [],
      customdata: ppTrendCustomData[d] || []
    }
    const trendTrace = Object.assign(pprTrendData, getTraceDefaults('line'))
    // trendTrace.name = 'ppr-trend-' + year + '-' + d.replace(' ', '-')
    trendTrace.name = categoriesStat[2] + ' ' + d
    // console.log(pprTraceData);
    return pprTrendData
  })

  // console.log(trendTraces)
  return trendTraces
}

async function initialiseMap (mapId) {
  try {
    proj4.defs('EPSG:29902', '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 \n\
  +x_0=200000 \n\+y_0=250000 +a=6377340.189 +b=6356034.447938534 +units=m +no_defs')
    const firstProjection = 'EPSG:29902'
    const secondProjection = 'EPSG:4326'

    const stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
    const osmPprMap = new L.TileLayer(stamenTonerUrl_Lite, getDefaultMapOptions())
    const pprMap = new L.Map(mapId, {
      dragging: !L.Browser.mobile,
      tap: !L.Browser.mobile
    })
    pprMap.setView(getDublinLatLng(), 11)
    pprMap.addLayer(osmPprMap)
    const pprMapIcon = L.icon({
      iconUrl: '../images/environment/microphone-black-shape.svg',
      iconSize: [20, 20] // orig size
    // iconAnchor: [iconAX, iconAY] //,
    // popupAnchor: [-3, -76]
    })
    const PPRMarker = L.Marker.extend({
      options: {
        id: 0
      }
    })

    const postcodesLayer = new L.LayerGroup()

    const postcodesJson = await fetchJsonFromUrlAsyncTimeout('../data/common/Postcode_dissolve_WGS84.json')
    console.log(postcodesJson)
    postcodesJson.features.forEach((d) => {
      // postcodesLayer.addData(feature)
      postcodesLayer.addLayer(L.geoJSON(d, {

        // style: getLayerStyle(i),
        // onEachFeature: onEachFeature

      })
      )
    })

    pprMap.addLayer(postcodesLayer)

    // const pprPopupOptons = {
    //   // 'maxWidth': '500',
    //   // 'className': 'leaflet-popup'
    // }

    // const pprSitesLayer = new L.LayerGroup()
    // const pprSites = await getSites('../data/Environment/soundsites.json', 'sound_monitoring_sites')
    // // console.log(pprSites)

    // const allSitesPromises = pprSites.map(async d => {
    //   const marker = new PPRMarker(
    //     new L.LatLng(d.lng, d.lat), {
    //       id: d.id,
    //       opacity: 0.9,
    //       title: 'PPR Monitor Site', // shown in rollover tooltip
    //       alt: 'ppr monitor icon',
    //       icon: pprMapIcon,
    //       type: 'PPR Level Monitor'
    //     })
    //   marker.bindPopup(getPopup(d), pprPopupOptons)
    //   marker.on('popupopen', () => {
    //     getPopupPlot(d)
    //   })
    //   pprSitesLayer.addLayer(marker)
    //   const siteReadings = await getSiteReadings(d)
    //   // console.log(siteReadings);
    //   return siteReadings
    // })
    // const allSitesData = await Promise.all(allSitesPromises)
    // // console.log(allSitesData);
    // let allSitesFlat = allSitesData.flat(1)
    // allSitesFlat = allSitesFlat.filter((s) => {
    //   return isToday(s.date)
    // })

  // pprMap.addLayer(pprSitesLayer)
  } catch (e) {
    console.log('Errror creating PPR map')
    console.log(e)
  }
}

async function addPostcodesToMap (mapId) {
  // let postcodesJson = await fetchJsonFromUrlAsyncTimeout('../data/common/Postcode_dissolve_WGS84.json')
  // console.log(postcodesJson);
  // postcodesJson.features.forEach((d)=>{

  // })
  //   let features = []

  //   let dataBase = '/data/tools/census2016/'
  //   let dcc0 = 'DCC_SA_0.geojson'
  //   let dcc1 = 'DCC_SA_1.geojson'
  //   let dcc2 = 'DCC_SA_2.geojson'
  // // promises
  //   let pDCC0 = d3.json(dataBase + dcc0)
  //   let pDCC1 = d3.json(dataBase + dcc1)
  //   let pDCC2 = d3.json(dataBase + dcc2)
  //   let dccSAs = await Promise.all([pDCC0, pDCC1, pDCC2]) // yields an array of 3 feature collections

  //   dccSAs.forEach(sas => {
  //     // updateMap(sas)

  //     sas.features.forEach(sa => {
  //       try{
  //         let groupNo = lookup[sa.properties.SMALL_AREA]
  //         sa.properties.groupnumber= groupNo

  //         addFeatureToLayer(sa, parseInt(groupNo) - 1) // feature, layer index

  //       }
  //       catch{

  //         sa.properties.groupnumber= 'NA'
  //         addFeatureToLayer(sa, 'NA') //Additional layer for NA sas
  //       }
  //       // console.log(layerNo)

  //     })
  //     //alert(JSON.stringify(sas.features))
  //   })

  // // Fingal, DL/R, SDCC
  //   let fcc = 'FCC_SA_0.geojson'
  //   let dlr = 'DLR_SA_0.geojson'
  //   let sdcc = 'SDCC_SA_0.geojson'
  //   let testd = 'Small_Areas__Generalised_20m__OSi_National_Boundaries.geojson'
  //   let pfcc = d3.json(dataBase + fcc)
  //   let pdlr = d3.json(dataBase + dlr)
  //   let psdcc = d3.json(dataBase + sdcc)
  //   let ts = d3.json(dataBase + testd)

  //   let otherSAs = await Promise.all([pfcc, pdlr, psdcc,ts])
  //   otherSAs.forEach(sas => {
  //     // updateMap(sas)
  //     sas.features.forEach(sa => {
  //       try{
  //         let groupNo = lookup[sa.properties.SMALL_AREA]
  //         sa.properties.groupnumber= groupNo

  //         addFeatureToLayer(sa, parseInt(groupNo) - 1) // feature, layer index

  //       }
  //       catch{
  //         //console.warn(`Error on lookup for sa. Adding to NA layer \n ${JSON.stringify(sa)} `)
  //         sa.properties.groupnumber= 'NA'
  //         addFeatureToLayer(sa, 'NA') //Additional layer for NA sas
  //       }

// })
// })
//   AddLayersToMap()
}

function getEmptyLayersArray (total) {
  const layersArr = []
  for (let i = 0; i < total; i += 1) {
    layersArr.push(L.geoJSON(null, {

      style: getLayerStyle(i),
      onEachFeature: onEachFeature

    })
    )
  }
  return layersArr
}
function addFeatureToLayer (feature, layerNo) {
  if (layerNo === 'NA') {

  } else {
    mapLayers[layerNo].addData(feature)
  }
}

function getLayerStyle (index) {
  return {
    fillColor: getLayerColor(index),
    weight: 0.3,
    opacity: 0.9,
    color: getLayerColor(index),
    // dashArray: '1',
    fillOpacity: 0.9
  }
}
function getLayerColor (index) {
  return GEODEMOS_COLORWAY[index]
}

function updateGroupTxt (no) {
  if (document.contains(document.getElementById('myhref'))) {
    document.getElementById('href').remove()
  }

  const dd = document.getElementById('desc')
  if (no === 'all') {
    no = 'all1'
  }

  d3.json('/data/home/geodem-text-data.json').then(function (dublinRegionsJson) {
    d3.select('#group-title').text(dublinRegionsJson[1][no]).style('font-size', '27px').style('font-weight', 'bold')
    //
    d3.select('#group-title').text(dublinRegionsJson[1][no])// .style("color",getLayerColor(no-1));
    d3.select('#group-text').text(dublinRegionsJson[0][no]).style('font-size', '15px')
  })
}
function getFColor (d) {
  return d > 2.0 ? '#FFFFFF'
    : d > 1.5 ? '#BFB6B3'
      : d > 1.0 ? '#d99a1c'
        : d > 1 ? '#989290'
          : d == 1 ? '#746F6D'

            : '#000000'
}
const ttt = []

const value = 0
const text = ''

function onEachFeature (feature, layer) {
  const customOptions =
    {
      maxWidth: '400',
      width: '250',
      className: 'popupCustom'
    }
  const popTextContent =
           '<p><b>Group ' + feature.properties.groupnumber + '</b></p>' +
           '<p><b>' + feature.properties.EDNAME + '</b></p>' +
           '<p><b>' + feature.properties.COUNTYNAME + '</b></p>' +
           '<p><b>SA ' + feature.properties.SMALL_AREA + '</b></p>'

  layer.bindPopup(popTextContent, customOptions)

  layer.on({
    click: function () {
    }
  })
}

d3.select('#group-buttons').selectAll('img').on('click', function () {
  const cb = $(this)
  const myv = $(this).attr('id')
  ResetImages(myv)
  let layerNo = myv === 'all' ? 'all' : parseInt(myv) - 1

  if (layerNo !== 'all') {
    mapLayers.forEach(l => {
      mapGeodemos.removeLayer(l)
    })

    const gn = layerNo + 1

    updateGroupTxt(gn)
    mapGeodemos.addLayer(mapLayers[layerNo])

    Plotly.react('chart-geodemos', [traces[layerNo]], layout)
  }
  // }

  layerNo = myv

  if (layerNo === 'all') { // 'all' && cb.attr("src")=='/images/icons/Icon_eye_selected.svg') {
    scatterHM()
    updateGroupTxt('all')
    AddLayersToMap()
  }
})

function AddLayersToMap () {
  mapLayers.forEach((l, k) => {
    // alert( soc_eco_val+ '---'+ traces[k].x[soc_eco_val])
    if (!mapGeodemos.hasLayer(l)) {
      const mlay = mapLayers[k]
      // let cov=traces[k-1].x[soc_eco_val];

      mapGeodemos.addLayer(mlay)

      mlay.setStyle({
        fillColor: getLayerColor(k)// getFColor(cov)

      }

      )
    }
  })
}

// console.log(traceNames)

// const housePriceMean = {
//   e: 'chart-house-price-mean',
//   d: ppTrend.filter(d => {
//     return d[dimensions[5]] === categoriesStat[2]
//   }),
//   ks: traceNames,
//   k: dimensions[3],
//   xV: 'date',
//   yV: 'value',
//   tX: 'Year',
//   tY: categoriesStat[2],
//   formaty: 'hundredThousandsShort'
// }
// //
// const housePriceMeanChart = new BCDMultiLineChart(housePriceMean)

// const housePriceMedian = {
//   e: 'chart-house-price-median',
//   d: ppTrend.filter(d => {
//     return d[dimensions[5]] === categoriesStat[3]
//   }),
//   ks: traceNames,
//   k: dimensions[3],
//   xV: 'date',
//   yV: 'value',
//   tX: 'Year',
//   tY: categoriesStat[3],
//   formaty: 'hundredThousandsShort'
// }
// //
// const housePriceMedianChart = new BCDMultiLineChart(housePriceMedian)

// const chart1 = 'house-price-mean'
// const chart2 = 'house-price-median'
// function redraw () {
//   if (document.querySelector('#chart-' + chart1).style.display !== 'none') {
//     housePriceMeanChart.drawChart()
//     housePriceMeanChart.addTooltip('Mean house price,  ', '', 'label')
//     housePriceMeanChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
//     housePriceMeanChart.showSelectedLabelsY([2, 4, 6, 8, 10, 12, 14])
//   }
//   if (document.querySelector('#chart-' + chart2).style.display !== 'none') {
//     housePriceMedianChart.drawChart()
//     housePriceMedianChart.addTooltip('Median house price, ', '', 'label')
//     housePriceMedianChart.showSelectedLabelsX([0, 2, 4, 6, 8, 10])
//     housePriceMedianChart.showSelectedLabelsY([2, 4, 6, 8, 10, 12, 14])
//   }
// }
// redraw()

// d3.select('#chart-' + chart1).style('display', 'block')
// d3.select('#chart-' + chart2).style('display', 'none')

// d3.select('#btn-' + chart1).on('click', function () {
//   if (document.getElementById('chart-' + chart1).style.display === 'none') {
//     activeBtn(this)
//     d3.select('#chart-' + chart1).style('display', 'block')
//     d3.select('#chart-' + chart2).style('display', 'none')
//     redraw()
//   }
// })

// d3.select('#btn-' + chart2).on('click', function () {
//   if (document.getElementById('chart-' + chart2).style.display === 'none') {
//     activeBtn(this)
//     d3.select('#chart-' + chart1).style('display', 'none')
//     d3.select('#chart-' + chart2).style('display', 'block')
//     redraw()
//   }
// })

// window.addEventListener('resize', () => {
//   redraw()
// })
