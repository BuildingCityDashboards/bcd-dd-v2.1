< script type = "text/javascript" >

  // Google Internal Site Search script- By JavaScriptKit.com (http://www.javascriptkit.com)
  // For this and over 400+ free scripts, visit JavaScript Kit- http://www.javascriptkit.com/
  // This notice must stay intact for use

  //Enter domain of site to search.
  var domainroot = "www.javascriptkit.com"

function Gsitesearch(curobj) {
  curobj.q.value = "site:" + domainroot + " " + curobj.qfront.value
}

<
/script>


<
form action = "http://www.google.com/search"
method = "get"
onSubmit = "Gsitesearch(this)" >

  <
  p > Search JavaScript Kit: < br / >
  <
  input name = "q"
type = "hidden" / >
  <
  input name = "qfront"
type = "text"
style = "width: 180px" / > < input type = "submit"
value = "Search" / > < /p>

  <
  /form>

  <
  p style = "font: normal 11px Arial" > This free script provided by < br / >
  <
  a href = "http://www.javascriptkit.com" > JavaScript Kit < /a></p >