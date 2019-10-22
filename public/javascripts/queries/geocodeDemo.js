/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
var map = new L.Map('map').addLayer(osm).setView([48.5, 2.5], 15);

var osmGeocoder = new L.Control.OSMGeocoder({placeholder: 'Search location...'});

map.addControl(osmGeocoder);


