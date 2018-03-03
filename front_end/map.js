var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: -33.865427, lng: 151.196123},
        mapTypeId: 'terrain'
    });

    // Create a <script> tag and set the USGS URL as the source.
    var script = document.createElement('script');


    var geocoder = new google.maps.Geocoder();

    document.getElementById('searchButton').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });
    // This example uses a local copy of the GeoJSON stored at
    // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
    script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
    document.getElementsByTagName('head')[0].appendChild(script);

    map.data.setStyle(function(feature) {
        var magnitude = feature.getProperty('mag');
        return {
            icon: getCircle(magnitude)
        };
    });
}

function getCircle(magnitude) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: .2,
        scale: Math.pow(2, magnitude) / 2,
        strokeColor: 'white',
        strokeWeight: .5
    };
}

function eqfeed_callback(results) {
    map.data.addGeoJson(results);
}

function geocodeAddress(geocoder, resultsMap) {
    var country = document.getElementById('countryInput').value;
    var city = document.getElementById('cityInput').value;
    var address = city + ", " + country;

    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function createMarker(position, map, title, icon, content) {
    var infowindow = new google.maps.InfoWindow({
        content: content
    })

    var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: title,
        icon: icon
    })

    marker.addListener('click', function() {
        infowindow.open(map, marker)
    })

    marker.setMap(map)

    return marker
}

function removeMarker(marker) {
    marker.setMap(null)
    marker = null;
}
