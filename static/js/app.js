let queryAPI = "https://ergast.com/api/f1/"
let queryDriver = "drivers.json?"
console.log(queryDriver);
// Set up the year selection
yearList = [];
currentYear = new Date().getFullYear();
currentYear = Number(currentYear);
firstDataYear = Number(1950);

for (let y = currentYear; y >= firstDataYear; --y) {
  yearList.push(y);
};

console.log("before init");
// Create URL
let queryUrl = queryAPI + document.getElementById('selYear').value + queryDriver;
let currentDriver = document.getElementById('selDataset').value;


let dropdownMenu = d3.select("#selDataset");
let yearMenu = d3.select("#selYear");

function init() {
    console.log("init");
    yearList.forEach((y)=>{yearMenu.append("option").text(y).property("value").code;  
    }); 

    driversYear_list = driverList(yearList[0]);
    };

function demographics(userInput) {
  userYear = document.getElementById('selYear').value
  let currentQuery = queryAPI + userYear + "/" + queryDriver;

  d3.json(currentQuery).then(function (data) {

      // The demographics info is in data.metadata
      // meta is the list of all metadata dictionaries
      driversYear = data.MRData.DriverTable.Drivers;          
      // meta = data.metadata;

      //filter... within meta (aka data.metadata) match record.ID (record is a single dictionary in the metadata list of dictionaries) to the userInput
      //selected is a all records (dictionaries) that match the ID of the userInput, of which there should only be one
      // selected = meta.filter((record)=>record.id == userInput);
      selected = driversYear.filter((record)=>(record.givenName + " " + record.familyName) == userInput);
      console.log(selected)
      //firstID is the first dictionary in the list of matching records, of which there should only have been one
      firstID = selected[0];
      console.log(firstID)
      let metaBox = d3.select("#sample-metadata");

      //A json dictionary is a js object. Object.entries() "returns an array of a given object's own enumerable string-keyed property [key, value] pairs".
      // select the div with id(#) "sample-metadata" (aka metaBox) and append the key: value pairs in the given text format
      Object.entries(firstID).forEach(([key, value])=>{metaBox.append("option").text(`${key}: ${value}`);
      })
})};



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


function getYear(value){
  console.log("get year");

  document.getElementById('selDataset').options.length = 0;
  //empty the "Demographic Info" box
  let metaBox = d3.select("#sample-metadata");
  metaBox.selectAll("*").remove();

  driverList(value);
};


// This function is called when a dropdown menu item is selected
function optionChanged(value) {
  console.log("option changed")

  //empty the "Demographic Info" box
  let metaBox = d3.select("#sample-metadata");
  metaBox.selectAll("*").remove();

  demographics(value);
};


    init();