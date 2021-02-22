var url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
var data = [];

const height = 600;
const width = 1400;
const padding = 80;
var start_year = "";
var end_year = "";
var baseTemp = "";
$(document).ready(() => {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            data = result;
            start_year = data.monthlyVariance[0].year;
            var arrayLength = data.monthlyVariance.length;
            end_year = data.monthlyVariance[arrayLength - 1].year;
            baseTemp = data.baseTemperature;
            console.log(data);
            console.log(start_year, end_year, baseTemp);

            d3
                .select("body")
                .append("title")
                .attr("id", "title")
                .text("Heat Map");

            const svg = d3
                .select("#main")
                .append("svg")
                .attr("id", "canvas")
                .attr("height", height)
                .attr("width", width);

            const descriptionBlock = svg
                .append("g")
                .attr("id", "description")
                .attr("transform", "translate(" + width / 2 + ",30)");

            descriptionBlock
                .append("text")
                .style("font-size", "30px")
                .attr("text-anchor", "center")
                .text("Monthly Global Land-Surface Temperature");

            descriptionBlock
                .append("text")
                .style("font-size", "20px")
                .attr("x", padding)
                .attr("y", padding / 2)
                .attr("text-anchor", "center")
                .text(
                    start_year + " - " + end_year + ": base temperature " + baseTemp + "℃"
                );

            const xScale = d3
                .scaleLinear()
                .domain([start_year, end_year])
                .range([padding, width - padding]);

            const yearSpecifier = "Y";
            const xAxis = d3
                .axisBottom(xScale)
                .tickFormat((d) => d3.format(yearSpecifier)(d));
            svg
                .append("g")
                .attr("id", "x-axis")
                .style("font-size", "14px")
                .attr("transform", "translate(0," + (height - padding) + ")")
                .call(xAxis);

            const yScale = d3
                .scaleTime()
                .domain([new Date(1970, 0, 1), new Date(1970, 11, 31)])
                .range([padding, height - padding]);

            const monthSpecifier = "%B";

            const yAxis = d3
                .axisLeft(yScale)
                .tickFormat(d3.timeFormat(monthSpecifier));

            svg
                .append("g")
                .attr("id", "y-axis")
                .style("font-size", "14px")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis);

            var bar_height = (height - 2 * padding) / 12;
            var bar_width = (width - 2 * padding) / (end_year - start_year);
            var div = d3.select("body")
                .append("div")
                .attr("id", "tooltip");

            svg
                .selectAll("rect")
                .data(data.monthlyVariance)
                .enter()
                .append("rect")
                .attr("x", (d) => xScale(d.year))
                .attr("y", (d) => yScale(new Date(1970, d.month - 1)))
                .attr("height", bar_height)
                .attr("width", bar_width)
                .attr("class", "cell")
                .style("fill", (d) => getGradient(d.variance + baseTemp))
                .attr("data-month", (d) => d.month - 1)
                .attr("data-year", (d) => d.year)
                .attr("data-temp", (d) => d.variance + baseTemp)
                .on("mouseover", (event, d) => {
                    var month = d3.timeFormat(monthSpecifier)(new Date(1970, d.month - 1));
                    div.transition()
                        .duration(200)
                        .style("opacity", 0.9)
                        .attr("data-year", d.year);

                    div.html(d.year + " - " +
                        month
                        + "<br/>" + (d.variance + baseTemp).toFixed(1) + "℃"
                        + "<br/>" + d.variance.toFixed(1) + "℃")
                        .style("left", (event.pageX - 60) + "px")
                        .style("top", (event.pageY - 110) + "px")
                        ;
                })
                .on("mouseout", () => {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            var legendArray = [
                { value: 1.7, color: "" },
                { value: 2.8, color: "#4575B4" },
                { value: 3.9, color: "#74ADD1" },
                { value: 5.0, color: "#ABD9E9" },
                { value: 6.1, color: "#E0F3F8" },
                { value: 7.2, color: "#FFFFBF" },
                { value: 8.3, color: "#FEE090" },
                { value: 9.4, color: "#FDAE61" },
                { value: 10.5, color: "#F46D43" },
                { value: 11.6, color: "#D73027" },
                { value: 12.7, color: "" },
                { value: 13.8, color: "" }
            ]

            const legendArrayValues = legendArray.map(v => v.value);
            const sortedLegendArrayValues = legendArrayValues.filter((value, index) => index != 0 && index != legendArrayValues.length - 1);
            const sortedLegendArray = legendArray.filter((value) => value.color != "");

            console.log(sortedLegendArray);
            // var legendScale = d3.scaleLinear()
            //     .domain([legendArrayValues[0],legendArrayValues[legendArrayValues.length-1]]);
            //     .range([padding,padding+360]);
            // const legendSpecifier = ".1f";

            //     var legendAxis = d3.axisBottom(legendScale)
            //     .tickValues(legendArrayValues)
            //     .ticksFormat((d)=>d3.format(legendSpecifier)(d));

            // var legendBar = svg
            //     .append("g")
            //     .attr("transform",
            //         "translate(600,500)")
            //     .call(legendAxis);

            const Scale = d3
                .scaleLinear()
                .domain([legendArrayValues[0],
                legendArrayValues[legendArrayValues.length - 1]])
                .range([padding, padding + 360]);

            const legendSpecifier = ".1f";
            const Axis = d3
                .axisBottom(Scale)
                .tickFormat((d) => d3.format(legendSpecifier)(d))
                .tickValues(sortedLegendArrayValues);

            var legend = svg
                .append("g")
                .attr("id", "legend")
                .style("font-size", "13px")
                .attr("transform", "translate(10," + (height - 20) + ")")
                .call(Axis);

            legend
            .selectAll("rect")
            .data(sortedLegendArray)
            .enter()
            .append("rect")
                .attr("x", (d) => Scale(d.value))
                .attr("y", -Scale(0.1))
                .attr("width", Scale(0.1))
                .attr("height", Scale(0.1))
                .style("fill", (d) => d.color);
                        
            // legend
            //     .append("rect")
            //     .attr("x", Scale(sortedLegendArray[0].value))
            //     .attr("y", height - 150)
            //     .attr("width", Scale(2))
            //     .attr("height", 50)
            //     .style("fill", sortedLegendArray[0].color);
        });



});

function getGradient(d) {
    if (d <= 2.8) {
        return "#3D429B";
    } else if (d <= 3.9) {
        return "#4575B4";
    } else if (d <= 5) {
        return "#74ADD1";
    } else if (d <= 6.1) {
        return "#ABD9E9";
    } else if (d <= 7.2) {
        return "#E0F3F8";
    } else if (d <= 8.3) {
        return "#FFFFBF";
    } else if (d <= 9.4) {
        return "#FEE090";
    } else if (d <= 10.6) {
        return "#FDAE61";
    } else if (d <= 11.7) {
        return "#F46D43";
    } else if (d <= 12.8) {
        return "#D73027";
    } else {
        return "#A50026";
    }
}
