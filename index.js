var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
var data = [];

const height = 600;
const width = 1200;
const padding = 80;
var start_year = "";
var end_year = "";
var baseTemp = "";
$(document).ready(() => {
    fetch(url)
        .then(response => response.json())
        .then(result => {
            data = result;
            start_year = (data.monthlyVariance)[0].year;
            var arrayLength = data.monthlyVariance.length;
            end_year = (data.monthlyVariance)[arrayLength - 1].year;
            baseTemp = data.baseTemperature;
            console.log(data);
            console.log(start_year, end_year, baseTemp);


            d3
                .select("body")
                .append("title").attr("id", "title")
                .text("Heat Map");

            const svg = d3
                .select("#main")
                .append("svg")
                .attr("id", "canvas")
                .attr("height", height)
                .attr("width", width);

            const descriptionBlock = svg
                .append("g")
                .attr("id", "description");

            descriptionBlock
                .append("text")
                .attr("x", (width - padding) / 2)
                .attr("y", padding)
                .style("font-size", "30px")
                .attr("text-anchor", "center")
                .text("Monthly Global Land-Surface Temperature")

            descriptionBlock
                .append("text")
                .attr("x", (width-padding) / 2+100)
                .attr("y", padding + 50)
                .style("font-size", "20px")
                .attr("text-anchor", "center")
                .text(start_year + " - " + end_year + ": base temperature " + baseTemp + "℃");
        });
});