/***
TODO:
#759
- refactor to use urls from lookup data/realtime-data-sources.json
- convert to thin controller, with application logic in service layer
***/

const getData = async url => {
    const fetch = require('node-fetch')
    try {
        const response = await fetch(url)
        const json = await response.json()
        return json
    } catch (error) {
        return console.log(error)
    }
}

exports.getLatest = async (req, res, next) => {
    const url = 'http://erc.epa.ie/real-time-air/www/aqindex/aqih_json.php'
    const response = await getData(url)
    res.send(response)
}
