# Processing CSO data from Statbank

**This short guide shows how to download and prepare data from the [Central Statistics Office](https://www.cso.ie/en/index.html) (CSO) of Ireland. This deals specifically with table data provided via [StatBank](https://statbank.cso.ie/px/pxeirestat/Statire/SelectTable/Omrade0.asp?Planguage=0) (i.e. not the StatBank JSON-stat API). It targets a flat structure for a comma seperated file (CSV) that may be more easily plotted (as we do on the [Dublin Dashboard](http://dublindashboard-beta.azurewebsites.net/)), but not strictly equal to [RFC 4180](https://www.loc.gov/preservation/digital/formats/fdd/fdd000323.shtml). For a quick set of CSV formation gudielines see e.g. [thoughtspot](https://www.thoughtspot.com/6-rules-creating-valid-csv-files)**

## Browse and search tables
The tables of data available from the CSO are located [here](https://statbank.cso.ie/webserviceclient/DatasetListing.aspx) (use CTRL+ click to open in new tab)

You can also use the [search box here](https://statbank.cso.ie/px/pxeirestat/statire/SelectTable/Omrade0.asp?Planguage=0), into which you can place the table number, if known.

## Select variables
We're working with the example of table E1071: Housing Stock and Vacancy Rate 1991 to 2016 by County and City, CensusYear and Statistic

* Select the required variables from the options and click *Show table*

![select variables](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.44.39.png)

* The returned table looks like this. Not exactly flat or easy to use as-is. (We will show how to parse this in code in a future guide.)

![shown table](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.45.06.png)

## Pivot table
* Use **Edit Table** to pivot the table by drag-and-drop; place the variables you require in rows or columns.

![choose pivot](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.45.14.png)

![pivot selections](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.45.38.png)

* At this point, we want variables as columns, with dates proceeding downwards as rows. There are still delineated by region, however.

![returned table](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.47.05.png)

## Flatten table

* Finally we'll use a spreadsheet program to flatten the data more fully and remove extraneous footnotes etc still present as shown below.
![table](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.47.31.png)

* We use the convention of naming the column containing the year as *date* and local authority name as *region* (both lowercase).  Our processed file looks like this:

![flattened table](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/docs/guides/images/Screen%20Shot%202019-11-24%20at%2013.48.38.png)

## Next steps
The next guide will describe a pattern for plotting your data on a web page.
