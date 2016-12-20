var x = document.getElementById("instruction");
var test = document.getElementById("test");

/**
 * Receive and send position once
 * Called when page is loaded
 */
function getLocation() { /*GetLocation HTML5 */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initialize, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser or device";
    }
}

/**
 * Receive and send position every 60 seconds automatically
 */
function sendContinuously(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendPositionAuto, showError);
        // todo: prevent asking for permissions each time
        setTimeout(sendContinuously, 60000);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser or device";
    }
}

/**
 * Called if an error occurs by recieving users location
 * (getLocation(), sendContinuously())
 * @param error
 */
function showError(error) {  /*Error List IN CASE getLocation has failed */
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation.";
            x.style.backgroundColor="red";
            createDefaultmap();
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred.";
            break;
    }
}

/**
 * positioning is denied by the user
 * default map is created
 */
function createDefaultmap(){
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
		"Light Map": light
	};
	/*
	var overlays = {
		"Density": density
	};*/

	L.control.layers(baseLayers).addTo(map); /*After creating WMS, should be: baseLayers,density */
}


/**
 * position is approved and page completely reloaded
 * @param position
 */
function initialize(position) {
    x.innerHTML ="Below you can see the density map, based on your current location:";

    var geojsonFeature = createGeoJSON(position);

	console.log(JSON.stringify(geojsonFeature)); /*TEST - Print JSON as string */
	// todo call sendPositionToServerr before createMap
	createMap(position);
	sendPositionToServer(geojsonFeature);

	/** sendContinuously();*/
}


/**
 * position is approved, but map is initialized (send position every 10 seconds)
 */
function sendPositionAuto(position) {
	var geojsonFeature = createGeoJSON(position);
	sendPositionToServer(geojsonFeature)
}


/**
 *
 * @param position
 * @returns {{type: string, properties: {time: string, accuracy: Number}, geometry: {type: string, coordinates: [*,*]}}}
 */
function createGeoJSON(position){
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
    return geojsonFeature;
}


/**
 * Create a map and and the WMS (if position is given)
 */
function createMap(position){
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
        "Light Map": light
    };

    var wmsLayer = L.tileLayer.wms('http://demo.opengeo.org/geoserver/ows?', {layers: 'nasa:bluemarble'}); /*WMS Layer to be received from WPS Team */

    var overlays = {
        "Density": wmsLayer
    };

    L.control.layers(baseLayers, overlays).addTo(map); /*After creating WMS, should be: baseLayers,density */
}


/**
 * Send geojsonFeature to server
 * @param geojsonFeature
 */
function sendPositionToServer(geojsonFeature){
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

