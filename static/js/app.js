const queryUrl = "https://ergast.com/api/f1/2022/drivers.json?"
let dropdownMenu = d3.select("#selDataset");
let yearMenu = d3.select("#selYear");

function init() {
    
    d3.json(queryUrl).then(function (data) {
        // console.log(data);
        drivers2022 = data.MRData.DriverTable.Drivers;
        
        console.log(drivers2022)

        drivers2022_list = [];
        for (let i in drivers2022) {
          drivers2022_list.push(drivers2022[i].givenName + " " + drivers2022[i].familyName);
        };

        drivers2022_list.forEach((i)=>{dropdownMenu.append("option").text(i).property("value").code;
      })
        demographics(drivers2022_list[0]);
    })};

function demographics(userInput) {
  d3.json(queryUrl).then(function (data) {

      // The demographics info is in data.metadata
      // meta is the list of all metadata dictionaries
      drivers2022 = data.MRData.DriverTable.Drivers;          
      // meta = data.metadata;

      //filter... within meta (aka data.metadata) match record.ID (record is a single dictionary in the metadata list of dictionaries) to the userInput
      //selected is a all records (dictionaries) that match the ID of the userInput, of which there should only be one
      // selected = meta.filter((record)=>record.id == userInput);
      selected = drivers2022.filter((record)=>(record.givenName + " " + record.familyName) == userInput);
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

function getYear(value)





// This function is called when a dropdown menu item is selected
function optionChanged(value) {
   
  //empty the "Demographic Info" box
  let metaBox = d3.select("#sample-metadata");
  metaBox.selectAll("*").remove();

  demographics(value);
};


    init();