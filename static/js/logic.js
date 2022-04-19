// The getCircuitURL function is called from app.js. All of the map-related functions are on this page (logic.js)

let mapAPI = "http://ergast.com/api/f1/";
let queryCircuit = "/circuits.json";

// Create a default "landing" map 
let myMap = L.map("map", {
  center: [
    25, 0
  ],
  zoom: 2,
  // layers: [googleTerrain, circuitLayer]
});

function createMap(circuitLayer) {
  
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

  // Creat an overlays object.
  let overlayMaps = {
    "Circuits": circuitLayer,
  };

  //myMap was originally here

  L.control.layers(baseMaps, overlayMaps).addTo(myMap); 
  // {collapsed: true}
};

function getCircuitURL(year) {
  console.log("get circuit url")
    circuitURL = (mapAPI + year + queryCircuit);

    console.log(circuitURL);

    return circuitURL;
};

function createMarkers(year){

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
      createMap(circuitLayer);
  });
};

//circuitLayer
function createNewMarkers(year){

  var marker = L.marker([0, 0]).addTo(map).bindPopup(`<b>Hello world!</b><br />The year changed to ${year}`);


console.log("create new markers")
  // circuitURL = getCircuitURL(year);

  //Remove a layer from the map
  // myMap.removeLayer(circuitLayer);
//   myMap.eachLayer(function (circuitLayer) {
//     myMap.removeLayer(circuitLayer)
// }); 


  // d3.json(circuitURL).then(function (data) {

  //   circuits = data.MRData.CircuitTable.Circuits
  //   console.log(circuits[0]);

  //   circuitIdList = []
  //   circuitMarkers = []

  //   for (let i in circuits) {
  //     circuit = circuits[i]
  //     if (circuitIdList.includes(circuit.circuitId) == false){
  //       circuitIdList.push(circuit.circuitId);
  //       // Leaflet uses lat-lon
  //       circuitMarkers.push(
  //         L.marker([circuit.Location.lat, circuit.Location.long]).bindPopup(`<h6>${circuit.circuitName}:<h6>${circuit.Location.locality}, ${circuit.Location.country}`)
  //       )};
  //   };
  //     let circuitLayer = L.layerGroup(circuitMarkers);

      //Add a layer to an already create map
  // });
};