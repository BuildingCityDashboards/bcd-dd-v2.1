'use-strict'
const fetch = require('node-fetch')

const getData = async url => {
    try {
        const response = await fetch(url)
        const text = await response.text()
        return text
    } catch (error) {
        return console.log(error)
    }
}

exports.getIndicatorData = async (req, res) => {
    const url = 'https://data.smartdublin.ie/dataset/4997223b-13b2-4c97-9e88-cd94c6d35aec/'


    let indicatorString;
    switch (req.params.indicatorNumber) {
        case '1':
            indicatorString = ''
            break
        case '2':
            indicatorString = 'resource/b12a5b77-37dd-4e3f-bb4b-199ba35e94a5/download/indicator-2-employment-by-sector.csv'
            break
        case '3':

            indicatorString = ''
            break
        case '8':

            indicatorString = 'resource/2da5e1ce-2a77-40f8-8d8d-c7f03885ab6b/download/indicator-8-public-transport.csv'
            break
        default:
            indicatorString = ''
            break
    }

    const response = await getData(url + indicatorString)
    res.send(response)
}