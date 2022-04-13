const queryUrl = "https://ergast.com/api/f1/2022/drivers.json?"
let dropdownMenu = d3.select("#selDataset");

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
      
  

// This function is called when a dropdown menu item is selected
function optionChanged(value) {
   
  //empty the "Demographic Info" box
  let metaBox = d3.select("#sample-metadata");
  metaBox.selectAll("*").remove();

  demographics(value);
  // charts(value);
  // gauge(value);

};



        //   charts(sampleID[0]);
        // //   gauge(sampleID[0]);
      // };

    //   function charts (userInput){
    //     d3.csv("../../Resources/F1_Constructor_Standings.csv").then(data => {
        //     console.log(data);
        //   chartSamples = data.samples;
        //   selected = chartSamples.filter((record)=>record.id == userInput);
        //   firstID = selected[0];
      
        //   //BAR CHART
        //   let barChart = [{
        //       type: "bar",
        //       x: firstID.sample_values.slice(0,10).reverse(),
        //       y: firstID.otu_ids.map(j=>`otu ${j}`).slice(0,10).reverse(),
        //       text: firstID.otu_labels.slice(0,10).reverse(),
        //       orientation: 'h'
        //   }];
      
        //   let barLayout = {
        //     title: { text: `Top 10 OTUs for Sample ${userInput}` },
        //     margin: {
        //       t: 23,
        //     },
        //     xaxis: {
        //       title: {
        //         text: "Read Counts"
        //       }
        //     },
        //     yaxis: {
        //       title: {
        //         text: "OTU IDs"
        //       }
        //     }
        //   };
      
        //   let barConfig = {responsive: true}
      
        //   Plotly.newPlot("bar", barChart, barLayout, barConfig);
      
          
      
        
    // )};

    init();