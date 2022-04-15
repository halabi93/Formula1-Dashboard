let queryAPI = "https://ergast.com/api/f1/"
let queryDriver = "drivers.json?"


// Set up the year selection
yearList = [];
currentYear = new Date().getFullYear();
currentYear = Number(currentYear);
firstDataYear = Number(1950);

for (let y = currentYear; y >= firstDataYear; --y) {
  yearList.push(y);
};

console.log("before init");

// FOR REFERENCE
// year = document.getElementById('selYear').value;
// driver = document.getElementById('selDataset').value;


let dropdownMenu = d3.select("#selDataset");
let yearMenu = d3.select("#selYear");

//This function runs when the page is loaded
function init() {
    console.log("init");
    yearList.forEach((y)=>{yearMenu.append("option").text(y).property("value").code;  
    }); 

    driverList(yearList[0]);
    driverStandings(yearList[0]);
    };

// This function fills out the Driver Demographics Section
function demographics(userInput) {
  userYear = document.getElementById('selYear').value
  let currentQuery = queryAPI + userYear + "/" + queryDriver;

  d3.json(currentQuery).then(function (data) {

      // Match the userInput to the json 
      driversYear = data.MRData.DriverTable.Drivers;          
      selected = driversYear.filter((record)=>(record.givenName + " " + record.familyName) == userInput);

      //firstID is the first dictionary in the list of matching records, of which there should only have been one
      firstID = selected[0];
      let metaBox = d3.select("#driver-metadata");

      //A json dictionary is a js object. Object.entries() "returns an array of a given object's own enumerable string-keyed property [key, value] pairs".
      Object.entries(firstID).forEach(([key, value])=>{metaBox.append("option").text(`${key}: ${value}`);
      })
})};

// WIP
function driverStandings(year){
  standingsQuery = "http://ergast.com/api/f1/" + year + "/driverStandings.json";
  console.log(standingsQuery);
  d3.json(standingsQuery).then(function (data) {
    console.log(data);
    let driverPositions = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    console.log(driverPositions);
    console.log(driverPositions[0].points);
  
    let standings_list = [];
    for(let d in driverPositions){
      console.log(driverPositions[d])
      let points = driverPositions[d].points;
      let givenName = driverPositions[d].Driver.givenName;
      let familyName = driverPositions[d].Driver.familyName;
      let wins = driverPositions[d].wins;
      let constructor = driverPositions[d].Constructors[0].name;

      console.log(points)
      standings_list.push({"Points": points, "Name": givenName + " " + familyName, "Wins": wins, "Constructor": constructor 
      });
      console.log(standings_list)   
    };
})
  // //BAR CHART
  // let barChart = [{
  //     type: "bar",
  //     x: driverPositions.points.slice(0,10).reverse(),
  //     y: driverPositions.Driver.familyName.map(j=>`otu ${j}`).slice(0,10).reverse(),
  //     text: `Wins: ${driverPositions.wins.slice(0,10).reverse()}`,
  //     orientation: 'h'
  // }];

  // let barLayout = {
  //   title: { text: `Driver Standings for ${year}` },
  //   margin: {
  //     t: 23,
  //   },
  //   xaxis: {
  //     title: {
  //       text: "Points"
  //     }
  //   },
  //   yaxis: {
  //     title: {
  //       text: "Driver"
  //     }
  //   }
  // };

  // let barConfig = {responsive: true}

  // Plotly.newPlot("bar", barChart, barLayout, barConfig);
};


// This function finds the driver list for a single given year
function driverList(year){
  console.log("driverList");

  queryUrl = queryAPI + year + "/" + queryDriver;
  console.log(queryUrl);
  // Create Driver list
  d3.json(queryUrl).then(function (data) {
    // console.log(data);
    driversYear = data.MRData.DriverTable.Drivers;
    
    console.log(driversYear);
    let driversYear_list = [];
    for (let i in driversYear) {
      driversYear_list.push(driversYear[i].givenName + " " + driversYear[i].familyName);
    };
    driversYear_list.forEach((driver)=>{dropdownMenu.append("option").text(driver).property("value").code;  
    });  
    demographics(driversYear_list[0]);
  })

};

// This function runs when the user changes the year
function getYear(value){
  console.log("get year");

  document.getElementById('selDataset').options.length = 0;
  //empty the "Demographic Info" box
  let metaBox = d3.select("#driver-metadata");
  metaBox.selectAll("*").remove();

  driverList(value);
  driverStandings(value);
};

// This function is called when a dropdown menu item is selected
function optionChanged(value) {
  console.log("option changed")

  //empty the "Demographic Info" box
  let metaBox = d3.select("#driver-metadata");
  metaBox.selectAll("*").remove();

  demographics(value);
};

//run when page is initialized
init();