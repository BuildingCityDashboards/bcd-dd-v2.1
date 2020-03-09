let dData = dublincoco.features[0].properties

const percentage = d3.format('.2%'),
  thousands = d3.format(',.3s'),
  popFormat = d3.format(',.5r'),
  maplocale = d3.formatLocale({
    'thousands': ',',
    'currency': ['€', '']
  }),
  euro = maplocale.format('$,.5r'),
  diff = (getPerChange(dData.POPULATION, dData.PREVPOPULATION)),
  diffIncome = (getPerChange(dData.INCOME, dData.PREVINCOME))

const dublin = d3.select('#about-dublin__card')

dublin.selectAll('#region__population').text(thousands(dData.POPULATION) + '')
dublin.select('#region__area').text(dData.AREA + '')
dublin.select('#region__age').text(dData.AGE + '')
dublin.selectAll('#region__income').text(euro(dData.INCOME) + '')
dublin.select('#region__prePopulation').text(thousands(dData.PREVPOPULATION) + '')
dublin.select('#region__populationIndicator').text(indicatorText(diff, '#region__populationIndicator', 'increased', false))
dublin.select('#region__populationChange').text(percentage(diff) + indicator_f(diff, '#region__populationChange', false))
dublin.select('#region__incomeIndicator').text(indicatorText(diff, '#region__incomeIndicator', 'grew', false))
dublin.select('#region__income__prev').text(euro(dData.PREVINCOME) + '')
dublin.select('#region__income__change').text(percentage(diffIncome) + indicator_f(diffIncome, '#region__income__change', false))
