var x = document.getElementById("instruction");
var test = document.getElementById("test");

function getLocation() { /*GetLocation HTML5 */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendPosition, showError);
        //setTimeout(getLocation, 10000) todo
    } else {
        x.innerHTML = "Geolocation is not supported by this browser or device";
    }
}



function showError(error) {  /*Error List IN CASE getLocation has failed */
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            x.style.backgroundColor="red";
            createDefaultmap();
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

function createDefaultmap(){ //In case user denied request for location//***************

var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmdhdmlzaCIsImEiOiJjaXFheHJmc2YwMDdoaHNrcWM4Yjhsa2twIn0.8i1Xxwd1XifUU98dGE9nsQ';
var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
outdoors = L.tileLayer(mbUrl, {id: 'mapbox.outdoors', attribution: mbAttr}),
satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr}),
dark = L.tileLayer(mbUrl, {id: 'mapbox.dark', attribution: mbAttr}),
light = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
satellitestreets = L.tileLayer(mbUrl, {id: 'mapbox.streets-satellite', attribution: mbAttr});

		var map = L.map('mapid', {
			center: [51.962038,7.625937], /*Munster DOM as default location */
			zoom: 15,
			layers: [satellite] // Default basemaplayer on startrup, can also give density map here to show by default)
		});

		var baseLayers = {
			"Grayscale": grayscale,
			"Streets": streets,
			"Outdoors": outdoors,
			"Satellite": satellite,
			"Satellite Streets": satellitestreets,
			"Dark Map": dark,
			"Light Map": light,
		};
		/*
		var overlays = {
			"Density": density
		};*/

		L.control.layers(baseLayers).addTo(map); /*After creating WMS, should be: baseLayers,density */
		

}


function sendPosition(position) {
	console.log("sending position to server"); // todo
    x.innerHTML ="Below you can see the density map, based on your current location:";	
	var d = new Date(position.timestamp); /*Get Time Stamp */
	var geojsonFeature = { /*Create GeoJSON Feature */
		"type": "Feature",
		"properties": {
			"time": d.toLocaleString(), /*Formatting of date*/
			"accuracy": position.coords.accuracy /*Given in meters*/
		},
		"geometry": {
			"type": "Point",
			"coordinates": [position.coords.latitude, position.coords.longitude]
		}
	};

	console.log(JSON.stringify(geojsonFeature)); /*TEST - Print JSON as string */
	console.log(geojsonFeature);
	var geojsonString= JSON.stringify(geojsonFeature);

	<!-- Create Map -->
	var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmdhdmlzaCIsImEiOiJjaXFheHJmc2YwMDdoaHNrcWM4Yjhsa2twIn0.8i1Xxwd1XifUU98dGE9nsQ';

	    var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
		    streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
			outdoors = L.tileLayer(mbUrl, {id: 'mapbox.outdoors', attribution: mbAttr}),
			satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr}),
			dark = L.tileLayer(mbUrl, {id: 'mapbox.dark', attribution: mbAttr}),
			light = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
			satellitestreets = L.tileLayer(mbUrl, {id: 'mapbox.streets-satellite', attribution: mbAttr})
			;
		var map = L.map('mapid', {
			center: [position.coords.latitude, position.coords.longitude],
			zoom: 17,
			layers: [satellite] // Default basemaplayer on startrup, can also give density map here to show by default)
		});

		var baseLayers = {
			"Grayscale": grayscale,
			"Streets": streets,
			"Outdoors": outdoors,
			"Satellite": satellite,
			"Satellite Streets": satellitestreets,
			"Dark Map": dark,
			"Light Map": light,
		};

		var wmsLayer = L.tileLayer.wms('http://demo.opengeo.org/geoserver/ows?', {layers: 'nasa:bluemarble'}); /*WMS Layer to be received from WPS Team */
		
		var overlays = {
			"Density": wmsLayer
		};

		L.control.layers(baseLayers, overlays).addTo(map); /*After creating WMS, should be: baseLayers,density */
			
	
	$.ajax({ 
		type: "POST",
		url: "https://giv-project13.uni-muenster.de:8443/api/1.0/GPS",
		data: geojsonFeature,
		// todo
		success: function (data, textStatus){
			alert ("Your location has been submitted to server!" + textStatus);
		},
		error: function (xhr, textStatus, error){
			alert ("An error has occured: " + error);
		}
	});
	

} 
	