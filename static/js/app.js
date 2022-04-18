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
  for (let y = currentYear; y >= firstDataYear; y--) {
    yearList.push(y);
  };

  // Turn list items into drop down options
  yearList.forEach((y)=>{yearMenu.append("option").text(y).property("value").code;  
  }); 

  document.getElementById('season-info').innerHTML = `${yearList[0]} Season Information`;

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

    // Need to find a way to format the dropdown items
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

      //Format the dictionary entries - The order here determines the order on the webpage
      firstID["Given Name"] = firstID["givenName"];
      delete firstID["givenName"];

      firstID["Family Name"] = firstID["familyName"];
      delete firstID["familyName"];

      firstID["Driver ID"] = firstID["driverId"];
      delete firstID["driverId"];

      if ("code" in firstID){
        firstID["Code"] = firstID["code"];
        delete firstID["code"];
      };
      
      if ("permanentNumber" in firstID){
        firstID["Permanent Number"] = firstID["permanentNumber"];
        delete firstID["permanentNumber"];
      };
      
      firstID["Date of Birth"] = firstID["dateOfBirth"];
      delete firstID["dateOfBirth"];

      firstID["Nationality"] = firstID["nationality"];
      delete firstID["nationality"];

      // Create URL from dictionary entry
      wiki_url = firstID["url"]
      delete firstID["url"];

      //Create new wikipedia link
      node = document.getElementById('wiki_link');
      node.insertAdjacentHTML('afterend', `<a href=${wiki_url} id = "bio_link">Wikipedia Bio</a>`);

      //A json dictionary is a js object. Object.entries() "returns an array of a given object's own enumerable string-keyed property [key, value] pairs".
      Object.entries(firstID).forEach(([key, value])=>{metaBox.append("option").text(`${key}: ${value}`);
      })

})};

// This function creates a bar chart with the Driver Standings for the user chosen year
function driverStandings(year){
  console.log("driverStandings")

  standingsQuery = queryAPI + year + "/driverStandings.json";

  d3.json(standingsQuery).then(function (data) {
    // console.log(data);
    let driverPositions = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    // console.log(driverPositions);
    // console.log(driverPositions[0].points);
  
    let seasonPoints = [];
    let fullName = [];
    let wins = [];
    let constructor = [];
    // console.log(seasonPoints);

    for(let d in driverPositions){
      seasonPoints.push(parseInt(driverPositions[d].points));

      fullName.push(driverPositions[d].Driver.givenName + " " + driverPositions[d].Driver.familyName);
      wins.push(driverPositions[d].wins);
      constructor.push(driverPositions[d].Constructors[0].name);    
      // break;
    };

    // //BAR CHART
    let barChart = [{
        type: "bar",
        x: seasonPoints.reverse(),
        y: fullName.reverse(),
        // text: `Wins: ${standings_list[0].wins}`,
        orientation: 'h',
        marker: {
          color: 'rgb(255, 24, 1)'
        },        
    }];

    let barLayout = {

      title: { text: `Driver Standings for ${year}` },
      height: 600,
      width: 445,
      // autosize: true,
      margin: {
        'pad': 10,
        t: 45,
        r: 0,
        l: 145
      },

      xaxis: {

        title: {
          text: "Points"
        }
      },
      // yaxis: {

      // }
      
    };

    let barConfig = {responsive: true}

    Plotly.newPlot("bar", barChart, barLayout);
  })
};

// This function runs when the user changes the year - note: no changes are made to "value" in this function
function getYear(value){
  console.log("get year");

  // Create header
  document.getElementById('season-info').innerHTML = `${value} Season Information`;

  // empty the previous driver list
  document.getElementById('selDataset').options.length = 0;

  //empty the "Demographic Info" box
  let metaBox = d3.select("#driver-metadata");
  metaBox.selectAll("*").remove();

  // Delete any wikipedia link currently in place
  old_node = document.getElementById('bio_link');
  old_node.remove()

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

  // Delete any wikipedia link currently in place
  old_node = document.getElementById('bio_link');
  old_node.remove()

  // Run functions with the passed "value"
  demographics(value);
};

// This will run when index.html is initialized
init();


const { Client } = require('pg')
const client = new Client()
client.connect()
client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  client.end()
})



// var postgres = require('postgres');

// var con = postgres.createConnection({
//   host: "localhost",
//   user: "postgres",
//   password: "postgres",
//   database: "postgres"
// });

// con.connect(function(err) {
//   if (err) throw err;
//   con.query("SELECT * FROM customers", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });