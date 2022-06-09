// FUNCTION #1 of 4
function buildCharts(patientID) {

  // READ & INTERPRET THE DATA
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Read in the JSON data
  d3.json("samples.json").then((data => {

      // Define samples
      var samples = data.samples
      var metadata = data.metadata
      var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

      // Filter by patient ID
      var filteredSample = samples.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

      // Create variables for chart
      // Grab sample_values for the bar chart
      var sample_values = filteredSample.sample_values

      // Use otu_ids as the labels for bar chart
      var otu_ids = filteredSample.otu_ids

      // use otu_labels as the hovertext for bar chart
      var otu_labels = filteredSample.otu_labels

      // BAR CHART
      // Create the trace
      var bar_data = [{
          // Use otu_ids for the x values
          x: sample_values.slice(0, 10).reverse(),
          // Use sample_values for the y values
          y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
          // Use otu_labels for the text values
          text: otu_labels.slice(0, 10).reverse(),
          type: 'bar',
          orientation: 'h',
          marker: {
              color: 'rgb(242, 113, 102)'
          },
      }]




      // Define plot layout
      var bar_layout = {
          title: "Top 10 Microbial Species in Belly Buttons",
          xaxis: { title: "Bacteria Sample Values" },
          yaxis: { title: "OTU IDs" }
      };

      // Display plot
      Plotly.newPlot('bar', bar_data, bar_layout)

      // BUBBLE CHART
      // Create the trace
      var bubble_data = [{
          // Use otu_ids for the x values
          x: otu_ids,
          // Use sample_values for the y values
          y: sample_values,
          // Use otu_labels for the text values
          text: otu_labels,
          mode: 'markers',
          marker: {
              // Use otu_ids for the marker colors
              color: otu_ids,
              // Use sample_values for the marker size
              size: sample_values,
              colorscale: 'YlOrRd'
          }
      }];


      // Define plot layout
      var layout = {
          title: "Belly Button Samples",
          xaxis: { title: "OTU IDs" },
          yaxis: { title: "Sample Values" }
      };

      // Display plot
      Plotly.newPlot('bubble', bubble_data, layout)

      // GAUGE CHART
      // Create variable for washing frequency
      var washFreq = filteredMetadata.wfreq

      // Create the trace
      var gauge_data = [
          {
              domain: { x: [0, 1], y: [0, 1] },
              value: washFreq,
              title: { text: "Washing Frequency (Times per Week)" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                  bar: {color: 'white'},
                  axis: { range: [null, 9] },
                  steps: [
                      { range: [0, 3], color: 'rgb(253, 162, 73)' },
                      { range: [3, 6], color: 'rgb(242, 113, 102)' },
                      { range: [6, 9], color: 'rgb(166, 77, 104)' },
                  ],
                  // threshold: {
                  //     line: { color: "white" },
                  // }
              }
          }
      ];

      // Define Plot layout
      var gauge_layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };

      // Display plot
      Plotly.newPlot('gauge', gauge_data, gauge_layout);
  }))


};


// FUNCTION #2 of 4
function populateDemoInfo(patientID) {

  var demographicInfoBox = d3.select("#sample-metadata");

  d3.json("samples.json").then(data => {
      var metadata = data.metadata
      var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

      console.log(filteredMetadata)
      Object.entries(filteredMetadata).forEach(([key, value]) => {
          demographicInfoBox.append("p").text(`${key}: ${value}`)
      })


  })
}

// FUNCTION #3 of 4
function optionChanged(patientID) {
  console.log(patientID);
  buildCharts(patientID);
  populateDemoInfo(patientID);
}

// FUNCTION #4 of 4
function initDashboard() {
  var dropdown = d3.select("#selDataset")
  d3.json("samples.json").then(data => {
      var patientIDs = data.names;
      patientIDs.forEach(patientID => {
          dropdown.append("option").text(patientID).property("value", patientID)
      })
      buildCharts(patientIDs[0]);
      populateDemoInfo(patientIDs[0]);
  });
};

init();

// Demographic Info
function demo(selectedPatientID) {
  d3.json("samples.json").then((data) => {
    var MetaData = data.metadata;
    var subject = MetaData.filter(
      (sampleobject) => sampleobject.id == selectedPatientID
    )[0];
    var demographicInfoBox = d3.select("#sample-metadata");
    demographicInfoBox.html("");
    Object.entries(subject).forEach(([key, value]) => {
      demographicInfoBox.append("h5").text(`${key}: ${value}`);
    });

    // Gauge (This is inside the Demographic function because it utilizes the metadata.)
    var guageData = [
      {
        domain: { x: [0, 5], y: [0, 1] },
        value: subject.wfreq,
        text: subject.wfreq,
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 10 },
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "rgb(248, 243, 236)" },
            { range: [1, 2], color: "rgb(239, 234, 220)" },
            { range: [2, 3], color: "rgb(230, 225, 205)" },
            { range: [3, 4], color: "rgb(218, 217, 190)" },
            { range: [4, 5], color: "rgb(204, 209, 176)" },
            { range: [5, 6], color: "rgb(189, 202, 164)" },
            { range: [6, 7], color: "rgb(172, 195, 153)" },
            { range: [7, 8], color: "rgb(153, 188, 144)" },
            { range: [8, 9], color: "rgb(132, 181, 137)" },
          ],
        },
      },
    ];

    var layout = {
      title: "<b>Belly Button Washing Frequency</b> <br>Scrubs Per Week</br>",
      width: 350,
      height: 350,
      margin: { t: 50, r: 25, l: 25, b: 25 },
    };
    Plotly.newPlot("gauge", guageData, layout);
  });
}

// Call the data into the inspector console. 
function init() {
  d3.json("samples.json").then(function (data) {
    console.log("samples.json:", data);
    // Set up the DropDown:
    let DropDown = d3.select(`#selDataset`);

    data.names.forEach((name) => {
      DropDown.append(`option`).text(name).property(`value`, name);
    });
    // Reset demographic info and visuals to first subject when page is refreshed.
    const firstSample = data.names[0];
    charts(firstSample);
    demo(firstSample);
  });
}
// Pull data for new subject into demo and visuals. 
function optionChanged(newSample) {
  charts(newSample);
  demo(newSample);
}

init();