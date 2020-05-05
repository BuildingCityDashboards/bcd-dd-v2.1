# Tools
* JSDocs

Run `./node_modules/.bin/jsdoc filename.js` to generate JSDocs in /out

# Design patterns and practices


## Modules
Modules provide common reusable functionality
* Server-side: tbc
* Client-side: see [leaflet map module](https://github.com/BuildingCityDashboards/bcd-dd-v2.1/blob/staging/public/javascripts/modules/leaflet-maps.js)


## Asynchronous fetching
### Libraries
* Server-side: use node-fetch, see tbc
* Client-side: use d3, see tbc


# BCD Code Style Guide and Conventions

* Use a beautify package e.g. for Atom https://github.com/Glavin001/atom-beautify and/or Prettier e.g. https://atom.io/packages/prettier-atom
* use uppercase variable names for all constant declarations of configuration variables.
## File Naming
* All client-side javascript files' names should use lowercase separated by underscores
* All server-side javascript (e.g. Node modules etc) files' names should use lowercase separated by hyphens

* Adopt clean code recommendations as per https://github.com/ryanmcdermott/clean-code-javascript
