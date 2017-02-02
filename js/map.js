/*Global Variables */
var map, baseLayers, HeatLayer;
var ctrl = new L.LayerGroup();
var x = document.getElementById("instruction");
var first = true;
var legend = L.control({position: 'bottomleft'});
var URL;
var timesliderDisabled = true;

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
        setTimeout(sendContinuously, 60000);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser or device";
    }
}

/**function Redirect() {
    window.location="about.html";
}*/


/**
 * Called if an error occurs by receiving users location
 * (getLocation(), sendContinuously())
 * @param error
 */
function showError(error) {  /*Error List IN CASE getLocation has failed */
        switch(error.code) {
        case error.PERMISSION_DENIED:
            window.location="https://giv-project13.uni-muenster.de/about.php?error=1";
            break;
        case error.POSITION_UNAVAILABLE:
            window.location="https://giv-project13.uni-muenster.de/about.php?error=2";
            break;
        case error.TIMEOUT:
            window.location="https://giv-project13.uni-muenster.de/about.php?error=3";
            break;
        default:
            window.location="https://giv-project13.uni-muenster.de/about.php?error=4";
            break;
    }
}

/**
 * position is approved and page completely reloaded
 * @param position
 */
function initialize(position) {
    x.innerHTML ="Below you can see the density map, based on your current location:";

    var geojsonFeature = createGeoJSON(position);

	console.log(JSON.stringify(geojsonFeature)); /*TEST - Print JSON as string */
	createMap(position);
	sendPositionToServer(geojsonFeature);

	sendContinuously();
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
    map = L.map('mapid', {
        center: [position.coords.latitude, position.coords.longitude],
        zoom: 17,
        layers: [satellite] // Default basemaplayer on startrup, can also give density map here to show by default)
    });

    baseLayers = {
        "Grayscale": grayscale,
        "Streets": streets,
        "Outdoors": outdoors,
        "Satellite": satellite,
        "Satellite Streets": satellitestreets,
        "Dark Map": dark,
        "Light Map": light
    };

    URL = "https://giv-project13.uni-muenster.de:8443/api/1.0/currentPicture";
    getCurrentImage();
} //end of createMap function


/*
* Requests image metadata from server
*/
function getCurrentImage() {
    $.ajax({
           url: URL,
          success: function(data) {
            //console.log(data);
            //createPNG(data);
            if (first==true) {
                createPNG(data);
            } else {
                refreshPNG(data);
            }
          },
          error: function(error, response, body) {
            alert ("Error retrieving heat map: "+error);
            console.log(error);
          }
       });

    if(timesliderDisabled)
        setTimeout(getCurrentImage, 1200)
}

/*
* Creates PNG based on image URL and bounding box
*/
function createPNG(picData) {
    var path = "/images/"+picData.path;
    var bbox = JSON.parse(picData.bbox);
    var imageBounds = [[bbox[0]], [bbox[1]]]; //If switched in DB: [[bbox[1][0],bbox[0][0]],[bbox[1][1],bbox[0][1]]]
    var image = L.imageOverlay(path, imageBounds).addTo(map);
    var timedate = picData.time;
    addTimestamp(timedate); 
    createLegend(image);
    //ctrl.addOverlay(L.imageOverlay(path, imageBounds), "Heat");
}

/*
* Creates Legend for map (first time) and adds the heat layer (image)
*/
function createLegend(layer) {
    first = false;
    HeatLayer = layer;
    overlays = {
        "Heat Map": HeatLayer
    };
    ctrl = L.control.layers(baseLayers, overlays).addTo(map);
    //getWMS();
}
/*
*  Refreshes PNG displayed on map
*/
function refreshPNG(picData) {
    map.removeLayer(HeatLayer);
    ctrl.removeLayer(HeatLayer);
    var path = "/images/"+picData.path;
    var bbox = JSON.parse(picData.bbox);
    var imageBounds = [[bbox[0]], [bbox[1]]];
    var timedate = picData.time;
    HeatLayer = L.imageOverlay(path, imageBounds).addTo(map);
    ctrl.addOverlay(HeatLayer, "Heat Map");
    addTimestamp(timedate);

    console.log("PNG Refreshed");


}

/*
* Add time stamp to map based on image metadata
*/
function addTimestamp(timedate) {
    //var date = timedate.substr(0,10);
    //var time = timedate.substr(11,8);
    date = new Date(timedate);
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = date.toLocaleString()+'<br>';
        return div;
    };
    legend.addTo(map);
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
        success: function (data, textStatus){
            //alert ("Your location has been submitted to server!" + textStatus);
        },
        error: function (xhr, textStatus, error){
            alert ("An error has occured sending position to server: " + error);
        }
    });
}



//========= timeslider ==========

// request data for timeslider
$(document).ready(function() {
   getTimesliderData();
});


function getTimesliderData(){
    // request to db to receive infos for all images uploaded in the last two hours
    $.ajax({
        // todo reset to 120 min
        url: 'https://giv-project13.uni-muenster.de:8443/api/1.0/timeslider/17200',
        /*Success*/
        success: function(data){
            console.log(data);
            initializeTimeslider(data);
        },
        /*error*/
        error: function (error) {
            console.log("error"+ error);
            alert(error.responseText);
        }
    });
}


// show one image for every 10 min in the last two hour
function initializeTimeslider(data){

    // objects of the images to show in the timeslider
    var imagesArray = [];
    // add the newest image in the array
    imagesArray.push(data[0]);

    // help variables
    var length = 0;
    var index = 1;
    var run = true;

    // fill the images array
    // go through all images in data array
    while (run){
        // search for the last inserted image, take the timestamp and substract seconds for 10 min
        var help = imagesArray[imagesArray.length-1];
        help = Date.parse(help.time);
        help = help - 600000;
        var newTime = data[length].time;

        // go through the images and search for the first one that is 10 min older than the last inserted one
        while (help <= Date.parse(newTime) && run){
            length++;
            if(length<data.length){
                newTime = data[length].time;
            } else {
                run = false;
            }
        }

        // insert the image into the array
        if(run)
        imagesArray.push(data[length]);
    }

    // show as many timestamps on the slider as images inserted in the array
    var min = 0;
    var max = imagesArray.length-1;

    // initialize timeslider
    $("#slider").slider({
        min: min,
        max: max,
        step: 1,
        value: max,         // position of the handler at the beginning
        disabled: timesliderDisabled,

        change: function( event, ui ) {
            // show the image on the map
            var index = ui.value+"";
            var image = imagesArray[max-index];
            refreshPNG(image);
        }
    });
}

function enableTimeslider(){
    if(timesliderDisabled){
        // timeslider enabled
        timesliderDisabled = false;
        $( "#slider" ).slider( "enable" );
        getTimesliderData();
    } else {
        // timeslider disabled
        timesliderDisabled = true;
        $( "#slider" ).slider( "disable" );
        // start automatic reload of the map again
        getCurrentImage();
    }
}

