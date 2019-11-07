let domainroot = "https://dublindashboard-beta.azurewebsites.net/";

function Gsitesearch(curobj) {
  curobj.q.value = "site:" + domainroot + " " + curobj.qfront.value
}