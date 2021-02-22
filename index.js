var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
var data = [];

const height = 700;
const width = 1300;
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
                .attr("id", "description")
                .attr("transform","translate("+(width/2)+",30)");

            descriptionBlock
                .append("text")
                .style("font-size", "30px")
                .attr("text-anchor", "center")
                .text("Monthly Global Land-Surface Temperature")

            descriptionBlock
                .append("text")
                .style("font-size", "20px")
                .attr("x",padding)
                .attr("y",padding/2)
                .attr("text-anchor", "center")
                .text(start_year + " - " + end_year + ": base temperature " + baseTemp + "℃");

            const xScale = d3
                .scaleLinear()
                .domain([start_year, end_year])
                .range([padding, width - padding]);

            const yearSpecifier = "Y";
            const xAxis = d3
                .axisBottom(xScale)
                .tickFormat(d => d3.format(yearSpecifier)(d));
            svg
                .append("g")
                .attr("id","x-axis")
                .style("font-size","14px")
                .attr("transform",
                "translate(0,"+(height-padding)+")")
                .call(xAxis);

            const yScale = d3
                .scaleTime()
                .domain([(new Date(1970,0,1)),
                    (new Date(1970,11,31))])
                .range([padding,height-padding]);

            
            const monthSpecifier="%B";

            const yAxis = d3
                .axisLeft(yScale)
                .tickFormat(d3.timeFormat(monthSpecifier));

            svg
                .append("g")
                .attr("id","y-axis")
                .style("font-size","14px")
                .attr("transform",
                "translate("+padding+",0)")
                .call(yAxis);

                var bar_height=(height-2*padding)/(12);
                var bar_width=(width-2*padding)/(end_year-start_year);
            svg
                .selectAll("rect")
                .data(data.monthlyVariance)
                .enter()
                .append("rect")
                .attr("x",d=>xScale(d.year))
                .attr("y",
                d=>yScale((new Date(1970,d.month-1))))
                .attr("height",bar_height)
                .attr("width",bar_width)
                .attr("class","cell")
                .attr("data-month",d=>d.month)
                .attr("data-year",d=>d.year)
                .attr("data-temp",d=>d.variance+baseTemp);

            
        });
});