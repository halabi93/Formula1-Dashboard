let slidervar = document.getElementById('slider');
noUiSlider.create(slidervar, {
    connect: true,
    start: [ 1, 35676000 ],
    range: {
        min: 1950,
        max: 2022
    }
});
document.getElementById('input-number-min').setAttribute("value", 1950);
document.getElementById('input-number-max').setAttribute("value", 2022);

let inputNumberMin = document.getElementById('input-number-min');
let inputNumberMax = document.getElementById('input-number-max');
inputNumberMin.addEventListener('change', function(){
    slidervar.noUiSlider.set([this.value, null]);
});
inputNumberMax.addEventListener('change', function(){
    slidervar.noUiSlider.set([null, this.value]);
});

slidervar.noUiSlider.on('update', function( values, handle ) {
  //handle = 0 if min-slider is moved and handle = 1 if max slider is moved
  if (handle==0){
      document.getElementById('input-number-min').value = values[0];
  } else {
      document.getElementById('input-number-max').value = values[1];
  }

})

startYear = document.getElementById('input-number-min').value;
endYear = document.getElementById('input-number-max').value;
console.log(startYear);



function getCircuitURLs() {
  let circuitURLs = [];
  for(year = startYear; year <= endYear; year++){
    circuitURLs.push("http://ergast.com/api/f1/" + year + "/circuits.json");

  }
  console.log(circuitURLs);

  console.log(startYear);


  createMarkers(circuitURL);
};

// const circuitURL = "http://ergast.com/api/f1/circuits.json";
// createMarkers(circuitURL)

function createMarkers(circuitURL){
  d3.json(circuitURL).then(function (data) {
    // console.log(data)
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
          L.marker([circuit.Location.lat, circuit.Location.long]).bindPopup(`<h3>${circuit.circuitName}:<h3>${circuit.Location.locality}, ${circuit.Location.country}`)
        )};
    };
      let circuitLayer = L.layerGroup(circuitMarkers);
      createMap(circuitLayer);
  });
};


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

  // Create a default "landing" map 
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [googleSat, circuitLayer]
  });

  L.control.layers(baseMaps, overlayMaps).addTo(myMap); 
  // {collapsed: true}

};
