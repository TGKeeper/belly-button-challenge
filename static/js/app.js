// store source URL
const url = ' https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// fetch JSON data
d3.json(url).then(function(data){
    console.log(data);
}); 

// init function to populate dropdown & charts 
function init(){

    //dropdown list variable 
    let dropdown = d3.select("#selDataset");

    //d3
    d3.json(url).then((data) => {

    let sample_ids = data.names;
    console.log(sample_ids);
        for (id of sample_ids){
            dropdown.append("option").attr("value", id).text(id);
        };

    let first_entry = sample_ids[0];
    console.log(first_entry);
    
    makeBar(first_entry);
    makeBubble(first_entry);
    makeDemographics(first_entry);
    }); 
};

function makeBar(sample){

    d3.json(url).then((data) => {

        let sample_data = data.samples;

        let results = sample_data.filter(id => id.id == sample);

        let first_result = results[0];
        console.log(first_result);

        let sample_values = first_result.sample_values.slice(0,10);

        let otu_ids = first_result.otu_ids.slice(0,10);

        let otu_labels = first_result.otu_labels.slice(0,10);
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //create the trace for bar chart
        let bar_trace = {
            x: sample_values.reverse(),
            y: otu_ids.map(item => `OTU ${item}`).reverse(),
            text: otu_labels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let layout = {title: "Top 10 OTUs"};
        Plotly.newPlot("bar", [bar_trace], layout);
    });
};

function makeBubble(sample){
    
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        
        let results = sample_data.filter(id => id.id == sample);

        let first_result = results[0];
        console.log(first_result);

        let sample_values = first_result.sample_values;

        let otu_ids = first_result.otu_ids;

        let otu_labels = first_result.otu_labels;
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //bubble chart trace
        let bubble_trace = {
            x: otu_ids.reverse(),
            y: sample_values.reverse(),
            text: otu_labels.reverse(),
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        };

        let layout = {
            title: "Bacteria Count for each Sample ID",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of Bacteria'}
        };
        Plotly.newPlot("bubble", [bubble_trace], layout); 
    });
};

//Demographic info function
function makeDemographics(sample){
  
    d3.json(url).then((data) => {
    
    let demographic_info = data.metadata;
     
    let results = demographic_info.filter(id => id.id == sample);
    
    let first_result = results[0];
    console.log(first_result);
    
    d3.select('#sample-metadata').text('');

    Object.entries(first_result).forEach(([key,value]) => {
        console.log(key,value);
        
        d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
    });
    
    });
};

// Detect change function
function optionChanged(value){
    
    console.log(value);
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
};

init();
