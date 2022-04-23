// The getCircuitURL function is called from app.js. All of the map-related functions are on this page (logic.js)
let mapAPI = "http://ergast.com/api/f1/";
let queryCircuit = "/circuits.json";

// Create the map without markers shortly after index.html initialization

//Street Map base layer
const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    // noWrap: true
});  

const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});

const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});

const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});

// Create a baseMaps object.
let baseMaps = {
  "Street Map": street,
  "Satellite (from Google)": googleSat,
  "Satellite with Borders": googleHybrid, 
  "Terrain (from Google)": googleTerrain,
};

let overlayMaps = {

};

// Create the map the shows at page start-up 
let myMap = L.map("map", {
  center: [
    25, 0
  ],
  zoom: 1.5,
  scrollWheelZoom: false,
  layers: [googleHybrid]
});

let layerControl = L.control.layers(baseMaps).addTo(myMap);

function getCircuitURL(year) {
    circuitURL = (mapAPI + year + queryCircuit);

    return circuitURL;
};

let layer_list = [];

//Set initial marker color
let marker_color = "FF1801"

function createMarkers(year){

  if (!layer_list.includes(`${year} Circuits`)){

  circuitURL = getCircuitURL(year);

  d3.json(circuitURL).then(function (data) {

    circuits = data.MRData.CircuitTable.Circuits

    circuitIdList = []
    circuitMarkers = []

    for (let i in circuits) {
      circuit = circuits[i]
      if (circuitIdList.includes(circuit.circuitId) == false){
        circuitIdList.push(circuit.circuitId);
        // Leaflet uses lat-lon
        circuitMarkers.push(
          L.circleMarker([circuit.Location.lat, circuit.Location.long], {
            stroke: true,
            weight: 1,
            fillOpacity: 1,
            color: "white",
            fillColor: marker_color,
            radius: 6
          }).bindPopup(`<h6>${circuit.circuitName}:<h6>${circuit.Location.locality}, ${circuit.Location.country}`)
        )};
    };

      let circuitLayer = L.layerGroup(circuitMarkers);
      layerControl.addOverlay(circuitLayer, `${year} Circuits`);
      circuitLayer.addTo(myMap);
  });

  // Push layer to the map
  layer_list.push(`${year} Circuits`);

  // Use chroma to darken the marker color for the next user selection - inside the if statement
  marker_color = chroma(marker_color).darken().hex();

  // Once black, start over on grey scale
  if (marker_color == "#000000"){
    marker_color = "#FFFFFF";
  }

  }; // End of if statement
};
