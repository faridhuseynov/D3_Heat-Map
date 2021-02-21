var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
var data = [];

const height = 600;
const width = 1200;
const padding = 80;
var start_year="";
var end_year="";

$(document).ready(() => {
    fetch(url)
        .then(response => response.json())
        .then(result => {
            data = result;
            console.log(data);
        })
})

d3
    .select("body")
    .append("title").attr("id", "title")
    .text("Heat Map");

const svg = d3
    .select("#main")
    .append("svg")
    .attr("id","canvas")
    .attr("height",height)
    .attr("width",width);

const descriptionBlock = svg
    .append("g")
    .attr("id","description");

descriptionBlock
    .append("text")
    .attr("x",(width-padding)/2)
    .attr("y",padding)
    .style("font-size","30px")
    .attr("text-anchor","center")
    .text("Monthly Global Land-Surface Temperature")