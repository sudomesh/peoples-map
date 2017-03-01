
var $ = require('jquery');
var L = require('leaflet');

function plotExample() {

  var sudoMeshHQPosition = [37.83499,-122.26432];

  var mymap = L.map('map').setView(sudoMeshHQPosition, 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'marcjuul/cizng13f0001n2ro1bau1xous',
    accessToken: 'pk.eyJ1IjoibWFyY2p1dWwiLCJhIjoiY2l6bmZ6ZDJmMDJsNjJxbDI2eWdpa2U1diJ9.OLtK_xSdi--ZNVAG2BHA_g'
  }).addTo(mymap);

  var pointA = new L.LatLng(37.85499,-122.22432);
  var pointB = new L.LatLng(37.83499,-122.26432);

  var marker = new L.marker(pointA, {
    //        icon: L.icon({}),
    title: 'hills',
    alt: 'hills',
    riseOnHover: true
  });

  marker.addTo(mymap);

  var marker2 = new L.marker(pointB, {
    //        icon: L.icon({}),
    title: 'sudo room',
    alt: 'sudo room',
    riseOnHover: true
  });

  marker2.addTo(mymap);


  var points = [pointA, pointB];

  var line = new L.Polyline(points, {
    color: 'green',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1
  });

  line.addTo(mymap);

}

$(document).ready(function() {
  
  plotExample();

});
