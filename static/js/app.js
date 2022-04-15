let queryAPI = "https://ergast.com/api/f1/"
let queryDriver = "drivers.json?"

let dropdownMenu = d3.select("#selDataset");
let yearMenu = d3.select("#selYear");

// The earliest year in the dataset, based on researching the API
let firstDataYear = Number(1950);

console.log("before init");

// FOR REFERENCE:
// year = document.getElementById('selYear').value;
// driver = document.getElementById('selDataset').value;

//This function runs when the page is loaded, fills out the year drop down, and makes function calls to fill out drop downs and run visuals
function init() {
  console.log("init");

  // Set up the year selection
  let yearList = [];
  let currentYear = new Date().getFullYear();
  currentYear = Number(currentYear);  // Convert to number just to be safe
  
  // Add all years to a list
  for (let y = currentYear; y >= firstDataYear; --y) {
    yearList.push(y);
  };

  // Turn list items into drop down options
  yearList.forEach((y)=>{yearMenu.append("option").text(y).property("value").code;  
  }); 

  // Call on the following functions to fill out visuals for index.html
  driverList(yearList[0]);
  driverStandings(yearList[0]);
};

// This function finds the driver list for a single given year
function driverList(year){
  console.log("driverList");

  // Use the year to create the query
  queryUrl = queryAPI + year + "/" + queryDriver;

  // Create Driver list
  d3.json(queryUrl).then(function (data) {

    // Navigate to the section of the JSON that has the driver information
    driversYear = data.MRData.DriverTable.Drivers;
    
    // Create the driver drop down menu
    let driversYear_list = [];

    for (let i in driversYear) {
      driversYear_list.push(driversYear[i].givenName + " " + driversYear[i].familyName);
    };

    driversYear_list.forEach((driver)=>{dropdownMenu.append("option").text(driver).property("value").code;  
    });  

    // Run the demographics function with the first driver in the list as default
    demographics(driversYear_list[0]);
  })

};

// This function fills out the Driver Demographics Section
function demographics(userInput) {

  // Find the current year selected and create the query url
  userYear = document.getElementById('selYear').value
  let currentQuery = queryAPI + userYear + "/" + queryDriver;

  // Get the query data
  d3.json(currentQuery).then(function (data) {

      // Match the userInput to a json entry
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

// This function runs when the user changes the year - note: no changes are made to "value" in this function
function getYear(value){
  console.log("get year");

  // empty the previous driver list
  document.getElementById('selDataset').options.length = 0;

  //empty the "Demographic Info" box
  let metaBox = d3.select("#driver-metadata");
  metaBox.selectAll("*").remove();

  // Run functions with the passed "value"
  driverList(value);
  driverStandings(value);
};

// This function is called when a dropdown menu item is selected - note: no changes are made to "value" in this function
function optionChanged(value) {
  console.log("option changed")

  //empty the "Demographic Info" box
  let metaBox = d3.select("#driver-metadata");
  metaBox.selectAll("*").remove();

  // Run functions with the passed "value"
  demographics(value);
};

// This will run when index.html is initialized
init();