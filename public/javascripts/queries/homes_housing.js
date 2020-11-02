// Load boundaries
const uri =
        // 'https://statbank.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/PEB06'
        'https://www.propertypriceregister.ie/website/npsra/pprweb.nsf/PPRDownloads?OpenForm&File=PPR-2020-09-Dublin.csv&County=Dublin&Year=2020&Month=09'

d3.json(uri).then(data => {
  console.log(data)
})
