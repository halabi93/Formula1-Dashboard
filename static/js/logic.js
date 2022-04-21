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
  zoom: 2,
  scrollWheelZoom: false,
  layers: [googleTerrain]
});

let layerControl = L.control.layers(baseMaps).addTo(myMap);

function getCircuitURL(year) {
  console.log("get circuit url")
    circuitURL = (mapAPI + year + queryCircuit);

    console.log(circuitURL);

    return circuitURL;
};

let layer_list = [];

function createMarkers(year){

  if (!layer_list.includes(`${year} Circuits`)){

  circuitURL = getCircuitURL(year);

  d3.json(circuitURL).then(function (data) {

    circuits = data.MRData.CircuitTable.Circuits
    console.log(circuits[0]);

    circuitIdList = []
    circuitMarkers = []

    for (let i in circuits) {
      circuit = circuits[i]
      if (circuitIdList.includes(circuit.circuitId) == false){
        circuitIdList.push(circuit.circuitId);
        // Leaflet uses lat-lon
        circuitMarkers.push(
          L.marker([circuit.Location.lat, circuit.Location.long]).bindPopup(`<h6>${circuit.circuitName}:<h6>${circuit.Location.locality}, ${circuit.Location.country}`)
        )};
    };
      let circuitLayer = L.layerGroup(circuitMarkers);
      layerControl.addOverlay(circuitLayer, `${year} Circuits`);
      circuitLayer.addTo(myMap);
  });

  // Push layer to the map
  layer_list.push(`${year} Circuits`);

  // Check and uncheck correct boxes
  checkBoxes(year);

  }; // End of if statement
};


function checkBoxes(year){
  console.log("checkboxes fcn");
  var ele=document.getElementsByTagName('input');  
  console.log(ele);
  list_o_checks = [];
  
  for(var i=0; i<ele.length; i++){  
    if(ele[i].type=='checkbox'){  
        list_o_checks.push(i)
      };  
  };

console.log(list_o_checks);

  // for(var i=0; i<ele.length; i++){  
  //     if(ele[i].type=='checkbox'){  
  //         ele[i].checked=true;  
  //     };
  // };
};
