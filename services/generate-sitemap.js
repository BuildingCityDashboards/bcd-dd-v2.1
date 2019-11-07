// siteMap = sm.createSitemap({
//   hostname: 'https://dublindashboard-beta.azurewebsites.net/',
//   cacheTime: 600000, // 600 sec - cache purge period
//   urls: [{
//       url: '/themes/',
//       changefreq: 'daily',
//       priority: 0.7
//     },
//     {
//       url: '/stories/',
//       changefreq: 'weekly',
//       priority: 0.3
//     },
//     {
//       url: '/queries/',
//       changefreq: 'weekly',
//       priority: 0.5
//     },
//     {
//       url: '/tools/',
//     } //img: "http://urlTest.com" }
//   ]
//
// });
//
// app.get('/sitemap.xml', function(req, res) {
//   siteMap.toXML(function(err, xml) {
//     if (err) {
//       return res.status(500).end();
//     }
//     res.header('Content-Type', 'application/xml');
//     res.send(xml);
//   })
//   // res.header('Content-Type', 'text/html');
//   // res.send("<h1>Site map response</h1>");
// });