
// //Capitalize the string given by the user
// export function capitalizestring(string){
//     const splitString = string.split(" ")
//     let newString = ""
//     for(x of splitString){
//         let formated = x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()
//         newString = (newString+ " "+ formated).trim() 
//     }
//         return newString    
// }


// // create a flag of the country
// export const createFlag = function(abb){
//     try{
//         abb.toLowerCase()
//     flagImage.src = `../flags/32/${abb}.png`
//     return flagImage
//     }catch(err){
//         flagImage.src = `../flags/32/_unknown.png`
//     }
    
// }
    



// //Clear the chart's canvas
// export function resetCanvas(){
//     myChart.remove()
//     var canvas = document.createElement('canvas')
//     canvas.id = "myChart"
//     canvas.width = "400"
//     canvas.height = "150"

//     newChart.append(canvas);
//     return newChart
   
// }

// //Clear the Pie chart
// export function resetCanvasPie(){
    
//     document.getElementById('pieChart').remove()
//     var canvas = document.createElement('canvas')
//     canvas.id = "pieChart"
//     canvas.width = "1234"
//     canvas.height = "617"
//     divpieChart.append(canvas)
//     return divpieChart
   
// }
// //Clear line chart
// export function resetCanvasLine(){
    
//     document.getElementById('line-chart').remove()
//     var canvas = document.createElement('canvas')
//     canvas.id = "line-chart"
//     canvas.width = "1234"
//     canvas.height = "617"
//     divLineChart.append(canvas)
//     return divLineChart
   
// }

// export function resetCanvasLineDeaths(){
    
//     document.getElementById('line-chart-deaths').remove()
//     var canvas = document.createElement('canvas')
//     canvas.id = "line-chart-deaths"
//     canvas.width = "1234"
//     canvas.height = "617"
//     diveLineDeathsChart.append(canvas)
//     return diveLineDeathsChart
   
// }

// // Find the second largest number of cases in Covcases (Exclude All). Then, return the value and the region.

// export function findSecondLargest(arrCovcases,arrRegions){
    
//     // find firstLargestNumber
//     firstLargestNumber = Math.max(...arrCovcases) 
//     // find the index of firstLargestNumber
//     index = arrCovcases.indexOf(firstLargestNumber) 
//     // Delete first largest number [It will always be "All"]
//     arrCovcases.splice(index, 1) 
//     // firstlargestNumber got removed, lets find next largest number
//     secondLargestNumber = Math.max(...arrCovcases) 
//     indexSecond = arrCovcases.indexOf(secondLargestNumber)
//     //Because I removed the first index, I added 1 to the new index
//     let finalIndex  = (Number(indexSecond) + 1) 
//     // Return the second largest value and the region name
//     if(secondLargestNumber == "-Infinity" && arrRegions[finalIndex] == "All"){
//         return["Unknown", "Unknown"]
//     }else{
//         return [secondLargestNumber, arrRegions[finalIndex]] 
//     }
    
// } 

// // Create a function that extracts only the 30 first elements of an array
// export function reduceArray(array){
//     array.splice(31, Number(array.length) - 31)
// }

// // Reverse date
// export function reverseDate(date){
//     let newString = date.split('-')
//     newString.reverse()
//     let joinString = newString.join('-')
//     return joinString
// }