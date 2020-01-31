// Load boundaries
let uri =
        'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/PEB06'

d3.json(uri).then(data => {
  console.log(data)
})
