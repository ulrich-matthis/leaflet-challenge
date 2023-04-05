// USGS link to JSON
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// world Map tile layer
var world = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

// map object prep
var myMap = L.map("map", {
    center: [39.8283, -103.5795], 
    zoom: 5,
    layers:[world]
});

// size of circle markers set based on magnitude of each event
function sizeCircle(magnitude) {
    return magnitude * 4;
};

// function to set fill colors of circles based on depth (colors from W3 schools chart)
function colorCircle(depth) {
    if (depth >= 90) {
        color = "#bd0026";
    }
    else if (depth < 90 && depth >= 70) {
        color = "#f03b20";
    }
    else if (depth < 70 && depth >= 50) {
        color = "#ffd633";
    }
    else if (depth < 50 && depth >= 30) {
        color = "#ffff00";
    }
    else if (depth < 30 && depth >= 10) {
        color = "#4dff88";
    }
    else if (depth < 10 && depth >= -10) {
        color = "#006622";
    };
  
    return color;
};

// access data from link
d3.json(url).then(data => {
    console.log(data);
// declare features path for data and assemble depth array
    var features = data.features;
    var depth_array = [];

    //for loop for data in JSON, includes declaration of pathways to create more concise code
    for (var e = 0; e < features.length; e++)   {
        var coordinates = features[e].geometry.coordinates;
        var lat = coordinates[1];
        var lon = coordinates[0];
// push depth data to the depth array
        var depth = coordinates[2];
        depth_array.push(depth);
// declaration of properties path variable to shorten code and help create popup message
        var properties = features[e].properties;

        var place = properties.place;
        var mag = properties.mag;
// creation of circle markers on each location within dataset
        circles = L.circleMarker([lat, lon], {
            color: "black",
            weight: 1,
            fillColor: colorCircle(depth),
            opactiy: 1,
            fillOpacity: 1,
            radius: sizeCircle(mag)
        }).bindPopup(`<h3>${place}</h3><br/>Magnitude: ${mag}<br/>Depth: ${depth} KM<br>`).addTo(myMap);
        
    };
// declare legend and set location
    var legend = L.control({ position: "bottomright" });

    // define function when legend is added and setup of label bins
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        var limits = [-10, 10, 30, 50, 70, 90];
        var title = "<h2>Tremor Depth in KM</h2>"

        // Add title to div
        div.innerHTML = title;
// loop to match bins with corresponding depth color tags
        for (var i = 0; i < limits.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorCircle(limits[i] + 1) + '"></i> ' +
                limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
        }
  
        return div;
    };
// legend added to map
    legend.addTo(myMap);

})