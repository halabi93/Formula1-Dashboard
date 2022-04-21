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
  createMarkers(yearList[0]);
  
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
    queryGraphs (driversYear_list[0]);
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
    let constructor = [];
    // console.log(seasonPoints);

    for(let d in driverPositions){
      position = Number(d) + 1;
      seasonPoints.push(parseInt(driverPositions[d].points));
      fullName.push(`${position}. ${driverPositions[d].Driver.givenName} ${driverPositions[d].Driver.familyName}, Wins: ${driverPositions[d].wins}`);
      constructor.push(driverPositions[d].Constructors[0].name);    
    };

    //BAR CHART
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
      // width: 725,
      autosize: true,
      margin: {
        'pad': 10,
        t: 45,
        r: 0,
        l: 225
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

    Plotly.newPlot("standings_bar", barChart, barLayout);
  })
};

// For the div with the circuit names


// Graphs dependent on queries to our own API
function queryGraphs (userInput) {
  console.log("query graphs");

  circuit_names = [];

  first_name = userInput.split(' ')[0];
  last_name = userInput.split(' ')[1];
  year = document.getElementById('selYear').value;

  // Create and call the query from our own API
  pit_query = "http://127.0.0.1:5000/avg-pit-time-per-driver/" + year + "/" + first_name + "/" + last_name;
  d3.json(pit_query).then(function (pit_data) {

    avg_pit_query = "http://127.0.0.1:5000/avg-pit-time/" + year;
    d3.json(avg_pit_query).then(function (ave_pit_data) {

      //Get API data into usable list
      ave_pit_times = [];
      for (let i in ave_pit_data){
        ave_pit_times.push(ave_pit_data[i].avg_pit_duration / 1000);
      }

      race_number = [];
      pit_times = [];
      for (let i in pit_data){
        race_number.push(Number(i) + 1);
        pit_times.push(pit_data[i].avg_pit_time / 1000);
      };

      let pit_bar = {
        //race
        x: race_number,
        y: pit_times,
        type: 'bar',
        name: `${userInput} Pit Duration`,
        marker: {
          color: 'rgb(255, 24, 1)'
        }
      };
     
      var ave_pit_bar = {
        x: race_number,
        y: ave_pit_times,
        type: 'bar',
        name: `${year} Average Pit Duration`,
        marker: {
          color: 'black'
        }
      };
      
      var graph_bars = [pit_bar, ave_pit_bar];
      
      var pit_layout = {
        showlegend: true,
        legend: {
          xanchor:"center",
          yanchor:"top",
          y:-0.15, // play with it
          x:0.5   // play with it
        },
        title: {
          text: `Pit Duration Comparison`,
          // xanchor: "left",
          // x: 250,
          margin: {
            l: 50
          }},
        // height: 600,
        // width: 300,
        // autosize: true,
        margin: {
          'pad': 0,
          t: 45,
          r: 0,
          l: 45
        },
  
        xaxis: {
  
          title: {
            text: "Race Number"
          }
        },
        yaxis: {
          title: {
            text: "Pit Duration (s)"
          }
        }
        
      };
      var pit_config = {responsive: true}

      if(year>2010){
        Plotly.newPlot('pit_bar', graph_bars, pit_layout, pit_config);
      }
      else{
        document.getElementById("pit_bar").innerHTML = "This data was never recorded!!!";
      }
      
    });
  });

  // Create and call the query from our own API
  lap_query = "http://127.0.0.1:5000/avg-lap-time-per-driver/" + year + "/" + first_name + "/" + last_name;
  d3.json(lap_query).then(function (lap_data) {

    avg_lap_query = "http://127.0.0.1:5000/avg-lap-time/" + year;
    d3.json(avg_lap_query).then(function (ave_lap_data) {

      //Get API data into usable list
      ave_lap_times = [];
      for (let i in ave_lap_data){
        ave_lap_times.push(ave_lap_data[i].avg_lap_time / 1000);
      }

      race_number = [];
      lap_times = [];
      for (let i in lap_data){
        race_number.push(Number(i) + 1);
        lap_times.push(lap_data[i].avg_lap_time / 1000);
      };

      let lap_bar = {
        //race
        x: race_number,
        y: lap_times,
        type: 'bar',
        name: `${userInput} Average Lap Time`,
        marker: {
          color: 'rgb(255, 24, 1)'
        }
      };
     
      var ave_lap_bar = {
        x: race_number,
        y: ave_lap_times,
        type: 'bar',
        name: `${year} Average Lap Duration`, 
        marker: {
          color: 'black'
        }
      };
      
      var graph_bars = [lap_bar, ave_lap_bar];
      
      var lap_layout = {
        showlegend: true,
        legend: {
          xanchor:"center",
          yanchor:"top",
          y:-0.15, // play with it
          x:0.5   // play with it
        },
        title: {
          text: `Lap Duration Comparison`,
          // xanchor: "left",
          // x: 250,
          margin: {
            l: 50
          }},
        // height: 600,
        // width: 300,
        // autosize: true,
        margin: {
          'pad': 0,
          t: 45,
          r: 0,
          l: 45
        },
  
        xaxis: {
  
          title: {
            text: "Race Number"
          }
        },
        yaxis: {
          title: {
            text: "Lap Time (s)"
          }
        }
      };
      var lap_config = {responsive: true}

      if(year>1997){
        Plotly.newPlot('lap_bar', graph_bars, lap_layout, lap_config);
      }
      else{
        document.getElementById("lap_bar").innerHTML = "This data was never recorded!!!";
      }
      
    });
  });

  // Create and call the query from our own API
  speed_query = "http://127.0.0.1:5000/fastest-lap-avg-speed-per-driver/" + year + "/" + first_name + "/" + last_name;
  d3.json(speed_query).then(function (speed_data) {

    avg_speed_query = "http://127.0.0.1:5000/avg-fastest-lap-speed/" + year;
    d3.json(avg_speed_query).then(function (ave_speed_data) {

      //Get API data into usable list
      ave_speed_times = [];
      
      for (let i in ave_speed_data){
        circuit_names.push(ave_speed_data[i].name);
        ave_speed_times.push(ave_speed_data[i].avg_fastest_lap);
      }

      race_number = [];
      speed_times = [];
      for (let i in speed_data){
        race_number.push(Number(i) + 1);
        speed_times.push(speed_data[i].fastest_lap_time);
      };

      let speed_bar = {
        //race
        x: race_number,
        y: speed_times,
        type: 'bar',
        name: `${userInput} Average Fastest Lap Speed`,
        marker: {
          color: '#339966'
        }
      };
     
      var ave_speed_bar = {
        x: race_number,
        y: ave_speed_times,
        type: 'bar',
        name: `${year} Average Fastest Lap Speed`,
        marker: {
          color: '#800080'
        }
      };
      
      var speed_bars = [speed_bar, ave_speed_bar];
      
      var speed_layout = {
        showlegend: true,
        legend: {
          xanchor:"center",
          yanchor:"top",
          y:-0.15, // play with it
          x:0.5   // play with it
        },
        title: {
          text: `Fastest Lap Average Speed Comparison`,
          // xanchor: "left",
          // x: 250,
          margin: {
            l: 50
          }},
        // height: 600,
        // width: 300,
        // autosize: true,
        margin: {
          'pad': 0,
          t: 45,
          r: 0,
          l: 45
        },
  
        xaxis: {
  
          title: {
            text: "Race Number"
          }
        },
        yaxis: {
          title: {
            text: "Average Speed (km/h)"
          }
        }
        
      };
      var speed_config = {responsive: true}

      if(year>1995){
        Plotly.newPlot('speed_bar', speed_bars, speed_layout, speed_config);
      }
      else{
        document.getElementById("speed_bar").innerHTML = "This data was never recorded!!!";
      }

      

      // Remove old circuit list
      old_circuits = document.querySelectorAll('#circuit-item');
      old_circuits.forEach(item => {
        item.remove();
      });
      // Fill out the circuit list
      if(year>1995){
        for (let i = (circuit_names.length - 1); i>= 0; i--){
          circuit_node = document.getElementById('circuit-list');
          circuit_node.insertAdjacentHTML('afterbegin', `<ul id = "circuit-item">&emsp; Circuit ${Number(i) + 1}: ${circuit_names[i]}</ul>`);
        };
      }

    });
  });
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
  createMarkers(value);
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
  queryGraphs(value);
};

// This will run when index.html is initialized
init();
