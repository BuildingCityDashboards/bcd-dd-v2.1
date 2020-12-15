import { fetchCsvFromUrlAsyncTimeout, fetchJsonFromUrlAsyncTimeout } from '../../modules/bcd-async.js'
import { getDateFromCommonString } from '../../modules/bcd-date.js'
import { getDefaultMapOptions, getDublinLatLng, getDublinBoundsLatLng } from '../../modules/bcd-maps.js'

import JSONstat from 'https://unpkg.com/jsonstat-toolkit@1.0.8/import.mjs'
import { activeBtn, addSpinner, removeSpinner, addErrorMessageButton, removeErrorMessageButton } from '../../modules/bcd-ui.js'
import { getTraceDefaults, getLayoutDefaults } from '../../modules/bcd-plotly-utils.js'

// import { TimeoutError } from '../modules/TimeoutError.js's

const dublinPostcodes =
['Dublin 1', 'Dublin 2', 'Dublin 3', 'Dublin 4', 'Dublin 5', 'Dublin 6', 'Dublin 7', 'Dublin 6W', 'Dublin 9', 'Dublin 8', 'Dublin 11', 'Dublin 10', 'Dublin 13', 'Dublin 12', 'Dublin 15', 'Dublin 14', 'Dublin 17', 'Dublin 16', 'Dublin 18', 'Dublin 20', 'Dublin 22', 'Dublin 24', '']

async function main (options) {
  const chartId = 'chart-property-price'
  const mapId = 'map-property-price'

  const mapIcon = L.icon({
    title: '',
    // number: '666',
    iconUrl: '/images/map_icons/one-house.svg',
    iconSize: [30, 30],
    iconAnchor: [0, 0],
    popupAnchor: [0, 0]
  })
  // const pprMapIcon = L.icon(mapIconConfig)

  // const PPRMarker = L.Marker.extend({
  //   options: {
  //     id: 0
  //   }
  // })

  const mapRef = await initialiseMap(mapId)

  const timeSelectorOptions = {
    bgcolor: '#2a383d',
    activecolor: '#546f78',
    y: 1.1,
    x: 0.5,
    xanchor: 'center',
    active: 2,
    label: 'test',
    buttons:
    [{
      step: 'year',
      stepmode: 'backward',
      count: 10,
      label: '10y'
    }, {
      step: 'year',
      stepmode: 'backward',
      count: 5,
      label: '5y'
    }, {
      step: 'year',
      stepmode: 'backward',
      count: 1,
      label: '1 year'
    }]
  }

  const yearsPlotted = ['2020']

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

  const pprLayout = JSON.parse(JSON.stringify(getLayoutDefaults('scatter')))
  pprLayout.xaxis.rangeselector = timeSelectorOptions
  pprLayout.xaxis.range = [new Date(2020, 0, 1), new Date()]
  pprLayout.yaxis.fixedrange = true
  pprLayout.yaxis.range = [valueRange.min, valueRange.max]
  pprLayout.updatemenus = [{
    // bgcolor: 'green',
    // fillcolor: 'green',
    y: 1.1,
    x: 0.1,
    yanchor: 'bottom',
    buttons: postcodeButtons
  }]
  pprLayout.paper_bgcolor = '#2a383d'
  pprLayout.plot_bgcolor = '#2a383d'
  // pprLayout.hoverlabel.bgcolor= "#FFF"
  // pprLayout.title.visible = false
  // pprLayout.colorway = CHART_COLORWAY
  // console.log(pprLayout)

  let pprPlot = document.getElementById(chartId)

  const pprOptions = {
    modeBarButtons: [['toImage', 'zoom2d', 'pan2d', 'select2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']],
    displayModeBar: true,
    displaylogo: false,
    showSendToCloud: false,
    responsive: true,
    toImageButtonOptions: {
      filename: 'Dublin Dashboard Query - Property Price Register',
      width: null,
      height: null,
      format: 'png'
    }
  }

  // Initialise a blank plot
  Plotly.newPlot(chartId, [], pprLayout, pprOptions)
  pprPlot = document.getElementById(chartId)
  // console.log(pprPlot)

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

    const dragLayer = document.getElementsByClassName('nsewdrag')[0]
    dragLayer.style.cursor = 'crosshair'

    // TODO: handle this state better
    let currentDropdownSelectedIndex = 0

    pprPlot.on('plotly_hover', function () {
      dragLayer.style.cursor = 'pointer'
    })

    pprPlot.on('plotly_unhover', function () {
      dragLayer.style.cursor = 'crosshair'
    })

    pprPlot.on('plotly_click', async function (data) {
      let pts = ''
      let d = {}
      for (let i = 0; i < data.points.length; i++) {
        pts = 'x = ' + data.points[i].x + '\ny = ' +
            data.points[i].y + '\n\n'
        d = data.points[i].customdata

        const annotateText = '' + data.points[i].x + ': €' + data.points[i].y
        // console.log(annotateText)

        const annotation = {
          text: annotateText,
          x: data.points[i].x,
          y: parseFloat(data.points[i].y)
        }

        const annotations = pprLayout.annotations || []

        // annotations.push(annotation)
        Plotly.relayout(chartId, { annotations: annotations })
      }
      // console.log('Closest point clicked:\n\n' + pts)
      // console.log(d)

      const geocodeQuery = `https://nominatim.openstreetmap.org/search/${d.Address}?format=json`
      const geocodeJson = await fetchJsonFromUrlAsyncTimeout(geocodeQuery, 5000)
      // console.log(geocodeJson)
      if (mapRef != null) {
        if (geocodeJson.length > 0) {
          const latlong = new L.LatLng(geocodeJson[0].lat, geocodeJson[0].lon)

          const marker = new L.Marker(
            latlong, {
            // id: d.id,
              opacity: 0.9,
              // title: 'PPR Monitor Site', // shown in rollover tooltip
              // alt: 'ppr monitor icon',
              icon: mapIcon
            // type: 'PPR Level Monitor'
            })

          marker.bindPopup(getPopup(d), {})
          // marker.on('popupopen', () => {
          // getPopupPlot(d)
          // })
          //   pprSitesLayer.addLayer(marker)

          mapRef.addLayer(marker)
          mapRef.panTo(latlong)
        } else {
          // console.log('Address not found')
          const findForm = document.querySelector('#map-property-price > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > form > input[type=text]:nth-child(1)')
          findForm.value = `${d.Address}`

          const dialogBox = document.getElementById('geocoder-dialog-box')
          if (dialogBox.classList.contains('hide')) {
            dialogBox.classList.remove('hide')
          }
        }
      }
    })

    // listens for time selector events
    pprPlot.on('plotly_relayout', async function (event) {
      const graphDiv = document.getElementById(chartId)
      // true when range selector changed
      if (arguments[0]['xaxis.range[0]'] != null) {
        const startYear = new Date(arguments[0]['xaxis.range[0]']).getFullYear()
        if (yearsPlotted.includes(startYear)) {
          // console.log(startYear + ' is already done')
          return null
        }

        for (let yr = +startYear; yr < 2020; yr += 1) {
          // => returns the number of traces
          // if (!yearsPlotted.includes('ppr-' + yr + '-' + d.replace(' ', '-'))) {
          yearsPlotted.push(yr)
          // console.log(yearsPlotted)
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
      const date = getDateFromCommonString(d['Date of Sale (dd/mm/yyyy)'])
      pprDates[`${d['Postal Code']}`].push(date)
      d.date = d['Date of Sale (dd/mm/yyyy)']
      // pprCustomData.push(d)
      if (!pprValues[`${d['Postal Code']}`]) {
        pprValues[`${d['Postal Code']}`] = []
      }
      const v = parseInt(d['Price (�)'].replace(/[�,]/g, ''))
      d.value = v
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
        customdata: pprCustomData[d] || [],
        hovertemplate: 'SOLD: %{x}, €%{y:,.0f} <extra></extra>'
      }
      const pprTrace = Object.assign(pprTraceData, getTraceDefaults('scatter'))
      // pprTrace.name = 'Sale:'
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
      customdata: ppTrendCustomData[d] || [],
      hovertemplate: 'MEAN: %{x}, €%{y:,.0f} <extra></extra>'
    }
    const trendTrace = Object.assign(pprTrendData, getTraceDefaults('line'))
    // trendTrace.name = '' //'Mean sale price: '// categoriesStat[2] + ' ' + d

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
    // TODO: move these to bcd-maps module
    const stamenTonerUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
    const stamenTerrainUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png'
    const stamenTonerUrl_Lite = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
    const stamenTonerUrl_BG = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png'
    const stamenTonerUrl_Lines = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.png'

    const osmPprMap = new L.TileLayer(stamenTonerUrl, getDefaultMapOptions())
    const pprMap = new L.Map(mapId, {
      dragging: !L.Browser.mobile,
      tap: !L.Browser.mobile
    })
    pprMap.setView(getDublinLatLng(), 11)
    pprMap.addLayer(osmPprMap)
    const postcodesLayer = new L.LayerGroup()

    const postcodesJson = await fetchJsonFromUrlAsyncTimeout('../data/common/Postcode_dissolve_WGS84.json')
    // console.log(postcodesJson)
    postcodesJson.features.forEach((d, i) => {
      // postcodesLayer.addData(feature)
      postcodesLayer.addLayer(L.geoJSON(d, {
        style: getLayerStyle(i),
        onEachFeature: onEachFeature
      }).bindTooltip(function (layer) {
        // console.log()
        const label = d.properties.Yelp_postc
        if (label.indexOf('Dublin') === 0) {
          return label.replace('ublin ', '')
        }
        return ''
      }, { permanent: true, direction: 'center', opacity: 1.0 })
      )
    })

    pprMap.addLayer(postcodesLayer)

    const geoFinder = new L.Control.OSMGeocoder({
      placeholder: 'Enter street name, area etc.',
      bounds: getDublinBoundsLatLng(),
      collapsed: false, /* Whether its collapsed or not */
      position: 'topright', /* The position of the control */
      text: 'Find', /* The text of the submit button */
      callback: function (results) {
        console.log(results)
        if (results != null && results.length > 0) {
          const bbox = results[0].boundingbox
          const	first = new L.LatLng(bbox[0], bbox[2])
          const	second = new L.LatLng(bbox[1], bbox[3])
          const bounds = new L.LatLngBounds([first, second])
          L.rectangle(bounds, { color: '#ff7800', weight: 1 }).addTo(this._map)
          // TODO: add marker with address details
          this._map.fitBounds(bounds)
        }
      }
    })

    pprMap.addControl(geoFinder)

    // Add a dialog that appears when an address is not found
    const dialogBox = document.createElement('div')
    dialogBox.setAttribute('id', 'geocoder-dialog-box')
    dialogBox.classList.add('hide')
    // const dialogText = document.createElement('div')
    // dialogText.setAttribute('id', 'geocoder-dialog-text')

    // dialogBox.appendChild(dialogText)

    const findForm = document.querySelector('#map-property-price > div.leaflet-control-container > div.leaflet-top.leaflet-right > div')
    findForm.appendChild(dialogBox)
    dialogBox.innerHTML = 'The address was not automatically found.<br>Refine above to search manually.'

    return pprMap
  } catch (e) {
    console.log('Errror creating PPR map')
    console.log(e)
  }
}

function getLayerStyle (index) {
  return {
    fillColor: 'transparent', // getLayerColor(index),
    weight: 4.0,
    opacity: 0.6,
    color: '#6fd1f6', // getLayerColor(index),
    // dashArray: '1',
    fillOpacity: 0.9
  }
}

function getLayerColor (index) {
  const GEODEMOS_COLORWAY_CATEGORICAL = ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17']
  const GEODEMOS_COLORWAY_CBSAFE = ['#d73027', '#f46d43', '#fdae61', '#fee090', '#abd9e9', '#74add1', '#4575b4']
  const GEODEMOS_COLORWAY = GEODEMOS_COLORWAY_CATEGORICAL
  // const gToLa =['Group1','Group2','Group3','Group4','Group5','Group6','Group7']
  index = index % GEODEMOS_COLORWAY.length

  return GEODEMOS_COLORWAY[index]
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
      className: '.leaflet-popup-content'
    }
  const popTextContent = '<p><b>' + feature.properties.Yelp_postc + '</b></p>'
  //  '<p><b>Group ' + feature.properties.groupnumber + '</b></p>' +
  //  '<p><b>' + feature.properties.EDNAME + '</b></p>' +
  //  '<p><b>' + feature.properties.COUNTYNAME + '</b></p>' +
  //  '<p><b>SA ' + feature.properties.SMALL_AREA + '</b></p>'

  layer.bindPopup(popTextContent, customOptions)
  // layer.bindTooltip("my tooltip text").openTooltip()

  // let label = L.marker(layer.getBounds().getCenter(), {
  //   icon: L.divIcon({
  //     className: 'label',
  //     html: feature.properties.NAME,
  //     iconSize: [100, 40]
  //   })
  // }).addTo(map);

  layer.on({
    click: function () {
    }
  })
}

function getPopup (d) {
  let str = ''
  d.Address != null ? str += `<p><b>${d.Address}</b></p>` : str += '<p><b>Address unknown</b></p>'
  d['Postal Code'] != null ? str += `<i>${d['Postal Code']}</i><br>` : str += '<i>Postal code unknown</i>'
  d.date != null ? str += `<p>Sold on ${d.date}</p>` : str += '<p>Date of sale unknown</p>'
  d.value != null ? str += `<p>€${d.value}</p>` : str += '<p>Sale price unknown</p>'
  d['Description of Property'] != null ? str += `<p>${d['Description of Property']}</p>` : str += ''
  // d['Not Full Market Price'] != null ? str += `<p>${d['Not Full Market Price']}</p>` : str += ''
  return str
}
