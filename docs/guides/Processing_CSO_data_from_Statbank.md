# Processing CSO data from Statbank

**This short guide shows how to download and prepare data from the [Central Statistics Office](https://www.cso.ie/en/index.html) (CSO) of Ireland. This deals specifically with table data provided via [StatBank](https://statbank.cso.ie/px/pxeirestat/Statire/SelectTable/Omrade0.asp?Planguage=0) (i.e. not the StatBank JSON-stat API). It targets a flat structure for a comma seperated file (CSV) that may be more easily plotted (as we do on the [Dublin Dashboard](http://dublindashboard-beta.azurewebsites.net/)), but not strictly equal to [RFC 4180](https://www.loc.gov/preservation/digital/formats/fdd/fdd000323.shtml). For a quick set of CSV formation gudielines see e.g. [thoughtspot](https://www.thoughtspot.com/6-rules-creating-valid-csv-files)**

## Browse and search tables
The tables of data available from the CSO are located [here](https://statbank.cso.ie/webserviceclient/DatasetListing.aspx) (use CTRL+ click to open in new tab)

You can also use the [search box here](https://statbank.cso.ie/px/pxeirestat/statire/SelectTable/Omrade0.asp?Planguage=0), into which you can place the table number, if known.


## Select variables
![select variables](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.44.39.png)

![shown table](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.45.06.png)

## Pivot table
![choose pivot](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.45.14.png)

![pivot selections](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.45.38.png)

## Flatten table

![returned table](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.47.05.png)

![table](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.47.31.png)

![flattened table](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.48.38.png)

## Next steps
The next guide will describe a pattern for plotting your data on a web page.
