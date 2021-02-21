var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
var data=[];
$(document).ready(()=>{
    fetch(url)
        .then(response=>response.json())
        .then(result=>{
            data=result;
            console.log(data);
        })
})