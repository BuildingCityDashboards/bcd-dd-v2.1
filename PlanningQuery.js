/* 
 Downloader for arcGIS service query for Dublin Planning Data
 */


var baseURL = "https://services.arcgis.com/NzlPQPKn5QF9v2US/arcgis/rest/services/IrishPlanningApplications/FeatureServer/0/query?";
        var where = "where=PlanningAuthority%3D%27Dublin+City+Council%27+OR+PlanningAuthority%3D%27Fingal+County+Council%27+OR+PlanningAuthority+%3D+%27South+Dublin+County+Council%27+OR+PlanningAuthority+%3D+%27Dun+Laoghaire+Rathdown+County+Council%27";
        var options1 = "&objectIds=&time=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false";
        var outFields = "&outFields=OBJECTID%2C+ApplicationNumber%2C+ReceivedDate%2C+DevelopmentAddress%2C%C2%A0DevelopmentPostcode%2C+DevelopmentDescription%2C%C2%A0PlanningAuthority%2C+Decision%2C+DecisionDate%2C+DecisionDueDate%2C+OneOffHouse%2C+AreaofSite%2C+FloorArea%2C+LandUseCode%2C+%C2%A0LinkAppDetails";
        var options2 = "&returnGeometry=true&multipatchOption=none&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=PlanningAuthority&groupByFieldsForStatistics=&outStatistics=&having=";
        var offset = "&resultOffset=";
        var options3 = "&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=";

