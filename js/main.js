

// Search by country PAGE
//DOM variables
const inputValue = document.getElementById('autoComplete')
const submitBtn = document.getElementById('btn')
const title = document.getElementById('title')
const flagImage = document.getElementById('flag-image')
const generalDetails = document.getElementById('general-details')
const footer = document.getElementById('footer')
// General details of search
const textCountry = document.getElementById('country')
const textPopulation = document.getElementById('population')
const lifeExpentancy = document.getElementById('life-expentancy')
const textCapital = document.getElementById('capital')
const confirmedCases = document.getElementById('confirmed-cases')
const deaths = document.getElementById('deaths')
const cityMost = document.getElementById('city-most')
const vaccAdministered = document.getElementById('administered')
const pVaccinated = document.getElementById('vaccinated')
const pPartiallyVac = document.getElementById('partially-vacc')
const infoUpdated = document.getElementById('info-update')
const newCasesInfo = document.getElementById('new-cases')
const newDeaths = document.getElementById('new-deaths')

// Hidden class
const showTable = document.querySelector('.hidden')
// Chart DOM variables (DIV charts)
const newChart = document.getElementById('newChart')
const divpieChart = document.getElementById('divpieChart')
const divLineChart = document.getElementById('dive-line-chart')
const diveLineDeathsChart = document.getElementById('div-line-deaths')

// Error messages
const barChartMessage = document.getElementById('message-1')
const pieChartMessage = document.getElementById('message-2')
const casesLineChartMesg = document.getElementById('message-3') 
const deathsLineChartMesg = document.getElementById('message-4') 
const inputErrorDiv = document.getElementById('input-error')
const inputErrorMsg = document.getElementById('input-error-msg')
const errorValueSearched = document.getElementById('error-value')
// URLs
const urlTotalCases = 'https://covid-api.mmediagroup.fr/v1/cases?country='
const urlVaccines = 'https://covid-api.mmediagroup.fr/v1/vaccines?country='
const urlConfirmed = 'https://covid-api.mmediagroup.fr/v1/history?country='

// Other variables




// Display availables countries in a list while user types
//1. Create an array by extracting all the available countries from the API

const countryList = ['United States']
async function loadCountries() {
    const response = await fetch('https://covid-api.mmediagroup.fr/v1/cases')
    const content = await response.json()
    for (const [country, value] of Object.entries(content)) {
        countryList.push(country)
    }
    // console.log(countryList)
}
loadCountries()

// Autocomplete.js
//Implement autocomplete.js to display a list of available countries while the user types.
const autoCompleteJS = new autoComplete({
    selector: "#autoComplete",
    placeHolder: "Type your country",
    data: {
        src: countryList,
        cache: true,
    },
    resultsList: {
        element: (list, data) => {
            if (!data.results.length) {
                // Create "No Results" message element
                const message = document.createElement("div");
                // Add class to the created element
                message.setAttribute("class", "no_result");
                // Add message text content
                message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
                // Append message element to the results list
                list.prepend(message);
            }
        },
        noResults: true,
    },
    resultItem: {
        highlight: true
    },
    events: {
        input: {
            selection: (event) => {
                const selection = event.detail.selection.value;
                autoCompleteJS.input.value = selection;
            }
        }
    },
    wrapper: true,
});
autoCompleteJS.init();



// Search Bottom - Create Event
submitBtn.addEventListener('click', clickBtn)
function clickBtn() {

    // User search
    let search = inputValue.value
    inputErrorDiv.style.display = "none"
    let displayTable = 0
    // Validate country searched by the user
    if (countryList.includes(search)){
        displayTable = 1
    }else{
        displayTable = 0
        inputErrorDiv.style.display = "block"
        inputErrorMsg.innerHTML = `<strong>"${search}"</strong> is not a valid country. Please try again.`
    }
    const displaySearch = displayTable == 1 ? showTable.style.display = "flex" : showTable.style.display = "none"
    

    if (search === "United States") {
        search = "US"
    } else {
        search = inputValue.value
        // console.log(search)
    }
    const startSeach = (`${urlTotalCases}${search}`)
    // console.log(startSeach)

    // Conect to urlTotalCases
    setupChart()
    async function loadCovid() {

        try{
            const response = await fetch(startSeach)
            const content = await response.json()
            let regions = []
            let covCases = []
            let totalDeaths = []
            let countryAbb = []
            let country = []
            var population = []
            let expentancy = []
            let capital = []

            for ([key, value] of Object.entries(content)) {
                regions.push(key)
                covCases.push(value.confirmed)
                totalDeaths.push(value.deaths)
                countryAbb.push(value.abbreviation)
                country.push(value.country)
                population.push(value.population)
                expentancy.push(value.life_expectancy)
                capital.push(value.capital_city)

            }
            // Copy covCases in highestvValue (otherwise it will alter the data)
            let highestValue = [...covCases]
            const affectedCity = findSecondLargest(highestValue, regions)
            cityMost.innerHTML = `${affectedCity[1]} \n - ${affectedCity[0]} cases`
             
            createFlag(countryAbb[0])
            // console.log(countryAbb[0])
            

            // console.log(totalDeaths[0], countryAbb[0], country[0], population[0], expentancy[0], capital[0], covCases[0])
            return { regions, covCases, totalDeaths, countryAbb, country, population, expentancy, capital }
        }
        catch (err) {
            if (err.response){
                console.log(`Response from API has failed: ${err}`)
                barChartMessage.innerHTML = "This information is not available at the moment. Try later please."
                document.querySelector('.msg-1').style.display = 'block'
            }else if(err.content){
                console.log(`Failed request: ${err}`)
            }else{
                console.log(err)
            }
        }
        
    }
    //Set up chart, define chart data and print it 
    async function setupChart() {
        const covidData = await loadCovid()
        // console.log(covidData.regions)
        textCountry.innerHTML = `${covidData.country[0]}`
        textPopulation.innerHTML = `${covidData.population[0]}`
        lifeExpentancy.innerHTML = `${covidData.expentancy[0]}`
        textCapital.innerHTML = `${covidData.capital[0]}`
        confirmedCases.innerHTML = `${covidData.covCases[0]}`
        deaths.innerHTML = `${covidData.totalDeaths[0]}`
        // console.log(`Display table = ${displayTable}`)


        // Create bar chart
        resetCanvas()
        const canvas = document.getElementById('myChart').getContext('2d')
        var myChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: covidData.regions,
                datasets: [{
                    label: `Current Total Covid-19 Cases in ${search}`,
                    data: covidData.covCases,
                    backgroundColor: 'rgba(255, 151, 47, 1)',
                    borderColor: 'none',
                    hoverBackgroundColor: 'rgba(0, 208, 255)',
                    hoverBorderColor: 'none',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }); myChart.clear() //Clear data each time a new search is made

    }
    let administered = []
    let partiallyVac = []
    let vaccinated = []
    let population2 = []

    // Conect to urlVaccines
    loadVaccines()
    async function loadVaccines() {
        try {
            const response = await fetch(`${urlVaccines}${search}`)
            const content = await response.json()
            for (const [key, value] of Object.entries(content)) {
                administered.push(value.administered)
                partiallyVac.push(value.people_partially_vaccinated)
                vaccinated.push(value.people_vaccinated)
                population2.push(value.population)
            }
            // fill the values on the respective Dom variables
            vaccAdministered.innerHTML = administered[0]
            pVaccinated.innerHTML = vaccinated[0]
            pPartiallyVac.innerHTML = partiallyVac[0]
    
    
            //Define chart data
            //1. People unvaccinated = population - vaccinated
            let unvaccinated = (Number(population2[0]) - Number(vaccinated[0]))
            // console.log(unvaccinated)
    
            //Set up pie chart
            resetCanvasPie()
            const canvaspie = document.getElementById('pieChart')
            var chartPie = new Chart(canvaspie, {
                type: 'pie',
                data: {
                    labels: [
                        'Fully vaccinated people',
                        'Unvaccinated and partially vaccinated people',
                    ],
                    datasets: [{
                        label: 'Covid-19 Vaccination',
                        data: [vaccinated[0], unvaccinated],
                        backgroundColor: [
                            'rgba(63, 39, 218)',
                            'rgba(255, 52, 72)',
                        ],
                        hoverOffset: 4,
                        borderColor: '#181924',
                    }]
                },
    
            }); chartPie.clear() //Clear data each time a new search is made
    
            return [administered[0], partiallyVac[0], vaccinated[0]]
            
        } catch (err) {
            if (err.response){
                console.log(`Response from API has failed: ${err}`)
                barChartMessage.innerHTML = "This information is not available at the moment. Try later please."
                document.querySelector('.msg-2').style.display = 'block'
            }else if(err.content){
                console.log(`Failed request: ${err}`)
            }else{
                console.log(err)
            }
        }
        

    }
    ConfirmedCasesDates()
    // Define array variables to extract data
    let dataDates = []
    let numCases = []
    let increments = []


    // Connect to urlConfirmed
    async function ConfirmedCasesDates() {
        try{
            casesLineChartMesg.style.display = "none"
            const response = await fetch(`${urlConfirmed}${search}&status=confirmed`)
            const content = await response.json()
            const entries = Object.entries(content.All.dates)
            reduceArray(entries)
            entries.reverse() //reverse data to organise data from earliest to latest case

            //loop the object entries and get total cases per day. To get specific num of cases per day,  push to increments the current total num of cases less the previous total num. of cases. 
            for (let i = 1; i < entries.length; i++) {
                const [date, value] = entries[i]
                const [nextDate, previousValue] = entries[i - 1] ?? entries[i]
                dataDates.push(date)
                numCases.push(value)
                increments.push(value - previousValue)

            }
            let update = dataDates[dataDates.length - 1] //last update of the info
            let newCases = increments[increments.length - 1] //last index of increments = num. of new cases
            infoUpdated.innerHTML = reverseDate(update)
            newCasesInfo.innerHTML = newCases

            // Test data
            // console.log(dataDates)
            // console.log(numCases)
            // console.log(increments)
            // console.log(update)
            // console.log(newCases)

            resetCanvasLine()
            const lineChart = document.getElementById('line-chart')

            var tensionChart = new Chart(lineChart, {
                type: 'line',
                data: {
                    labels: dataDates,
                    datasets: [{
                        label: `Daily total number of cases in ${search} in the last 30 days`,
                        data: increments,
                        fill: false,
                        borderColor: 'rgba(63, 39, 218)',
                        tension: 0.1
                    }]
                },
            }); tensionChart.clear() //Clear data each time a new search is made

        }
        catch (err) {
            if (err.response){
                console.log(`Response from API has failed: ${err}`)
                barChartMessage.innerHTML = "This information is not available at the moment. Try later please."
                document.querySelector('.msg-3').style.display = 'block'
            }else if(err.content){
                console.log(`Failed request: ${err}`)
            }else{
                console.log(err)
            }
        }
        
    }

    let deathDates = []
    let lastDeaths = []
    ConfirmedDeaths()
    async function ConfirmedDeaths() {
        try{
            deathsLineChartMesg.style.display = "none"
            const response = await fetch(`${urlConfirmed}${search}&status=deaths`)
            const content = await response.json()
            const objectEntries = Object.entries(content.All.dates)
            reduceArray(objectEntries)
            objectEntries.reverse()

            for (let i = 1; i < objectEntries.length; i++) {
                const [date, deathNumber] = objectEntries[i]
                const [currentDeathValue, previousDeathValue] = objectEntries[i - 1] ?? objectEntries[i]
                deathDates.push(date)
                lastDeaths.push(deathNumber - previousDeathValue)
            }
            let lastDeathcase = lastDeaths[lastDeaths.length - 1]
            newDeaths.innerHTML = lastDeathcase
            // console.log(lastDeaths)
            // console.log(lastDeathcase)
            // console.log(deathDates)

            resetCanvasLineDeaths()
            const lineChartDeaths = document.getElementById('line-chart-deaths')
            var tensionChartDeaths = new Chart(lineChartDeaths, {
                type: 'line',
                data: {
                    labels: deathDates,
                    datasets: [{
                        label: `Daily total number of deaths in ${search} in the last 30 days`,
                        data: lastDeaths,
                        fill: false,
                        borderColor: 'rgba(255, 52, 72)',
                        tension: 0.1
                    }]
                },


            }); tensionChartDeaths.clear() //Clear data each time a new search is made
        }catch (err) {
            if (err.response){
                console.log(`Response from API has failed: ${err}`)
                barChartMessage.innerHTML = "This information is not available at the moment. Try later please."
                document.querySelector('.msg-4').style.display = 'block'
            }else if(err.content){
                console.log(`Failed request: ${err}`)
            }else{
                console.log(err)
            }
        }
        

    }

}





//Capitalize the string given by the user
function capitalizestring(string) {
    const splitString = string.split(" ")
    let newString = ""
    for (x of splitString) {
        let formated = x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()
        newString = (newString + " " + formated).trim()
    }
    return newString
}


// create a flag of the country
function createFlag(abb) {
    
    if (abb === undefined){
        flagImage.src = `../flags/32/_unknown.png`
        return flagImage
    }else{
        flagImage.src = `../flags/32/${abb}.png`
        return flagImage
    }
    
}


//Clear the chart's canvas
function resetCanvas() {
    myChart.remove()
    var canvas = document.createElement('canvas')
    canvas.id = "myChart"
    canvas.width = "400"
    canvas.height = "150"

    newChart.append(canvas);
    return newChart

}

//Clear the Pie chart
function resetCanvasPie() {

    document.getElementById('pieChart').remove()
    var canvas = document.createElement('canvas')
    canvas.id = "pieChart"
    canvas.width = "1234"
    canvas.height = "617"
    divpieChart.append(canvas)
    return divpieChart

}
//Clear line chart
function resetCanvasLine() {

    document.getElementById('line-chart').remove()
    var canvas = document.createElement('canvas')
    canvas.id = "line-chart"
    canvas.width = "1234"
    canvas.height = "617"
    divLineChart.append(canvas)
    return divLineChart

}

function resetCanvasLineDeaths() {

    document.getElementById('line-chart-deaths').remove()
    var canvas = document.createElement('canvas')
    canvas.id = "line-chart-deaths"
    canvas.width = "1234"
    canvas.height = "617"
    diveLineDeathsChart.append(canvas)
    return diveLineDeathsChart

}

// Find the second largest number of cases in Covcases (Exclude All). Then, return the value and the region.

function findSecondLargest(arrCovcases, arrRegions) {

    // find firstLargestNumber
    firstLargestNumber = Math.max(...arrCovcases)
    // find the index of firstLargestNumber
    index = arrCovcases.indexOf(firstLargestNumber)
    // Delete first largest number [It will always be "All"]
    arrCovcases.splice(index, 1)
    // firstlargestNumber got removed, lets find next largest number
    secondLargestNumber = Math.max(...arrCovcases)
    indexSecond = arrCovcases.indexOf(secondLargestNumber)
    //Because I removed the first index, I added 1 to the new index
    let finalIndex = (Number(indexSecond) + 1)
    // Return the second largest value and the region name
    if (secondLargestNumber == "-Infinity" && arrRegions[finalIndex] == "All") {
        return ["Unknown", "Unknown"]
    } else {
        return [secondLargestNumber, arrRegions[finalIndex]]
    }

}

// Create a function that extracts only the 30 first elements of an array
function reduceArray(array) {
    array.splice(31, Number(array.length) - 31)
}

// Reverse date
function reverseDate(date) {
    let newString = date.split('-')
    newString.reverse()
    let joinString = newString.join('-')
    return joinString
}





