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
    const url = 'https://data.smartdublin.ie/dataset/4997223b-13b2-4c97-9e88-cd94c6d35aec/resource/b12a5b77-37dd-4e3f-bb4b-199ba35e94a5/download/indicator-2-employment-by-sector.csv'
    const response = await getData(url)
    res.send(response)
}