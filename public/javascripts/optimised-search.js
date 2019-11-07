// Possible solution to fast search within text

// from https://stackoverflow.com/questions/47494373/optimizing-json-querying-performance-in-javascript

// Since you are trying to search for a substring of values it is not a good idea to use indexeddb as suggested. You can try flattening the values of the fields to text where fields seperated by :: and each key in the object is a line in the text file:
//
// {
//   key1:{
//     one:"one",
//     two:"two",
//     three:"three"
//   },
//   key2:{
//     one:"one 2",
//     two:"two 2",
//     three:"three 2"
//   }
// }
// Will be:
//
// key1::one::two::three
// key2::one 2::two 2::three
// Then use regexp to search for text after the keyN:: part and store all keys that match. Then map all those keys to the objects. So if key1 is the only match you'd return [data.key1]
//
// Here is an example with sample data of 10000 keys (search on laptop takes couple of milliseconds but have not tested when throttling to mobile):

//array of words, used as value for data.rowN
const wordArray = ["actions", "also", "amd", "analytics", "and", "angularjs", "another", "any", "api", "apis", "application", "applications", "are", "arrays", "assertion", "asynchronous", "authentication", "available", "babel", "beautiful", "been", "between", "both", "browser", "build", "building", "but", "calls", "can", "chakra", "clean", "client", "clone", "closure", "code", "coherent", "collection", "common", "compiler", "compiles", "concept", "cordova", "could", "created", "creating", "creation", "currying", "data", "dates", "definition", "design", "determined", "developed", "developers", "development", "difference", "direct", "dispatches", "distinct", "documentations", "dynamic", "easy", "ecmascript", "ecosystem", "efficient", "encapsulates", "engine", "engineered", "engines", "errors", "eslint", "eventually", "extend", "extension", "falcor", "fast", "feature", "featured", "fetching", "for", "format", "framework", "fully", "function", "functional", "functionality", "functions", "furthermore", "game", "glossary", "graphics", "grunt", "hapi", "has", "having", "help", "helps", "hoisting", "host", "how", "html", "http", "hybrid", "imperative", "include", "incomplete", "individual", "interact", "interactive", "interchange", "interface", "interpreter", "into", "its", "javascript", "jquery", "jscs", "json", "kept", "known", "language", "languages", "library", "lightweight", "like", "linked", "loads", "logic", "majority", "management", "middleware", "mobile", "modular", "module", "moment", "most", "multi", "multiple", "mvc", "native", "neutral", "new", "newer", "nightmare", "node", "not", "number", "object", "objects", "only", "optimizer", "oriented", "outside", "own", "page", "paradigm", "part", "patterns", "personalization", "plugins", "popular", "powerful", "practical", "private", "problem", "produce", "programming", "promise", "pure", "refresh", "replace", "representing", "requests", "resolved", "resources", "retaining", "rhino", "rich", "run", "rxjs", "services", "side", "simple", "software", "specification", "specifying", "standardized", "styles", "such", "support", "supporting", "syntax", "text", "that", "the", "their", "they", "toolkit", "top", "tracking", "transformation", "type", "underlying", "universal", "until", "use", "used", "user", "using", "value", "vuejs", "was", "way", "web", "when", "which", "while", "wide", "will", "with", "within", "without", "writing", "xml", "yandex"];
//get random number
const rand = (min, max) =>
  Math.floor(
    (Math.random() * (max - min)) + min
  );
//return object: {one:"one random word from wordArray",two:"one rand...",three,"one r..."}
const threeMembers = () => ["one", "two", "three"].reduce(
  (acc, item) => {
    acc[item] = wordArray[rand(0, wordArray.length)];
    return acc;
  }, {}
);
var i = -1;
data = {};
//create data: {row0:threeMembers(),row1:threeMembers()...row9999:threeMembers()}
while (++i < 10000) {
  data[`row${i}`] = threeMembers();
}
//convert the data object to string "row0::word::word::word\nrow1::...\nrow9999..."
const dataText = Object.keys(data)
  .map(x => `${x}::${data[x].one}::${data[x].two}::${data[x].three}`)
  .join("\n");
//search for someting (example searching for "script" will match javascript and ecmascript)
//  i in the regexp "igm" means case insensitive
//return array of data[matched key]
window.searchFor = search => {
  const r = new RegExp(`(^[^:]*).*${search}`, "igm"),
    ret = [];
  var result = r.exec(dataText);
  while (result !== null) {
    ret.push(result[1]);
    result = r.exec(dataText);
  }
  return ret.map(x => data[x]);
};
//example search for "script"
console.log(searchFor("script"));