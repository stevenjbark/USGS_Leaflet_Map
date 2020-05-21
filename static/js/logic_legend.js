//Alternate approach for multiple datasets: Instead of multiple searches as in logic4.js, try using all data, then parsing out into individual
//arrays. Save each array as Big and Mid for different magnitude ranges.


//GETTING THE DATA FROM USGS
//Initial query for GeoJSON files on all earthquakes from USGS for past week.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Create earthquakeMarkers list for appending earthquake markers from USGS
var earthquakeMarkersBig = []
var earthquakeMarkersMid = []
var earthquakeMarkersSml = []

    //Access url (4.5+ earthquakes), acquire GeoJSON data, all data we want in "features" keyword for list of dictionaries. Append to earthquakeMarkersBig list.
    d3.json(url, function(data) {

        data.features.forEach(function(input) {
            var latlng = [input.geometry.coordinates[1], input.geometry.coordinates[0]];
            var magnitude = input.properties.mag;
            var place = input.properties.place;
            var time = new Date(input.properties.time).toLocaleString();

        

        if (magnitude >= 4.5) {
            marker = L.circle(latlng, {
                color: "red",
                radius: magnitude * 30000
                }).bindPopup(`<h3> Magnitude: ${magnitude} </h3> <hr> <p> ${place} <p> <hr> <p> ${time} </p> <hr> <p> LatLon: ${latlng} </p>`);
            earthquakeMarkersBig.push(marker);
        }
        else if (magnitude > 2.5 && magnitude < 4.5) {
            marker = L.circle(latlng, {
                color: "yellow",
                radius: magnitude * 30000
                }).bindPopup(`<h3> Magnitude: ${magnitude} </h3> <hr> <p> ${place} <p> <hr> <p> ${time} </p> <hr> <p> LatLon: ${latlng} </p>`);
            earthquakeMarkersMid.push(marker)
        }
        else {
            marker = L.circle(latlng, {
                color: "green",
                radius: magnitude * 30000
                }).bindPopup(`<h3> Magnitude: ${magnitude} </h3> <hr> <p> ${place} <p> <hr> <p> ${time} </p> <hr> <p> LatLon: ${latlng} </p>`);
            earthquakeMarkersSml.push(marker) 
        }
        
        });

        console.log(earthquakeMarkersBig.length);
        console.log(earthquakeMarkersMid.length);
        console.log(earthquakeMarkersSml.length);


//Create a layer for all of the earthquakeMarkers
var earthquakeLayerBig = L.layerGroup(earthquakeMarkersBig);
var earthquakeLayerMid = L.layerGroup(earthquakeMarkersMid);
var earthquakeLayerSml = L.layerGroup(earthquakeMarkersSml);

//First we must generate a tileLayer for display. These are the baseMaps
var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 10,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 10,
    id: "mapbox.dark",
    accessToken: API_KEY
});

//Define baseMaps for display in control menu
var baseMaps = {
    "Satellite Map": satellitemap,
    "Dark Map": darkmap
}

//Define overlayMap for display of earthquake data from earthquakes variable.
var overlayMaps = {
    "Earthquakes_4.5+": earthquakeLayerBig,
    "Earthquakes_2.5-4.5": earthquakeLayerMid,
    "Earthquakes_1.0-2.5": earthquakeLayerSml
}

//Create map object in Leaflet
var earthquakeMap = L.map("map", {
    center: [10.0, 0.00],
    zoom: 2,
    layers: [darkmap, earthquakeLayerBig, earthquakeLayerMid, earthquakeLayerSml]
});

//Create layer control menu
L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(earthquakeMap);

});