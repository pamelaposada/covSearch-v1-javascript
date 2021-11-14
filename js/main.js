

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

// API URLs
const urlTotalCases = 'https://covid-api.mmediagroup.fr/v1/cases?country='
const urlVaccines = 'https://covid-api.mmediagroup.fr/v1/vaccines?country='
const urlConfirmed = 'https://covid-api.mmediagroup.fr/v1/history?country='


// 1. Filtering results
// Filter the results and display availables countries in a list while user types a valid search (valid search = coutry names inside an array)

//1.a Create an array by extracting all available countries from the API

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
//1.b Implement autocomplete.js to display a list of available countries while the user types.
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

// 2. Create an event by clicking the search button. The user can display the search results by country and connect to the API data.

submitBtn.addEventListener('click', clickBtn)
function clickBtn() {

    //2.a Limit the user search. The search will be displayed on the screen just if the value matches the CountryList array
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
    
    // Add United States as a valid search (It appears as US in the API)
    if (search === "United States") {
        search = "US"
    } else {
        search = inputValue.value
        // console.log(search)
    }

    // 2.b connect to https://covid-api.mmediagroup.fr/v1/cases?country={country}
    const startSeach = (`${urlTotalCases}${search}`)
    setupChart()
    async function loadCovid() {
        // 2.b.1 Define response and content(answer) variables. Then loop the content to get the data needed. Do this by using a try statement.
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
             
            // Add the country's flag by using the createFlag funtion
            createFlag(countryAbb[0])
            
            // Test data 
            // console.log(totalDeaths[0], countryAbb[0], country[0], population[0], expentancy[0], capital[0], covCases[0])
            return { regions, covCases, totalDeaths, countryAbb, country, population, expentancy, capital }
        }
        catch (err) {
            // 2.b.2 Define possible errors. Then, generate a message in case the API response, content or other error happens.
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
    //2.b.3 Extract the data needed from loadCovid function and print it into the DOM
    async function setupChart() {
        const covidData = await loadCovid()
        // console.log(covidData.regions)
        textCountry.innerHTML = `${covidData.country[0]}`
        textPopulation.innerHTML = `${covidData.population[0]}`
        lifeExpentancy.innerHTML = `${covidData.expentancy[0]}`
        textCapital.innerHTML = `${covidData.capital[0]}`
        confirmedCases.innerHTML = `${covidData.covCases[0]}`
        deaths.innerHTML = `${covidData.totalDeaths[0]}`

        //2.b.4 Set up a bar chart using the data extracted from startSearch and print the data in the DOM
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

    // 2.c Define the arrays where the data from the API will be pushed. Then connect to https://covid-api.mmediagroup.fr/v1/vaccines?country={country} 

    let administered = []
    let partiallyVac = []
    let vaccinated = []
    let population2 = []

    // 2.c.1 Start the asynchronous function to connect with the API and define response and content(answer) variables. Then, loop the content and return the needed data.
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
            //2.c.2 Print the values on the respective Dom variables
            vaccAdministered.innerHTML = administered[0]
            pVaccinated.innerHTML = vaccinated[0]
            pPartiallyVac.innerHTML = partiallyVac[0]
    
    
            //2.c.3 Define chart data
            //People unvaccinated = population - vaccinated
            let unvaccinated = (Number(population2[0]) - Number(vaccinated[0]))
            // console.log(unvaccinated)
    
            //2.c.4 Set up a pie chart using vaccinated and unvaccinated data
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
            // 2.c.5 Define possible errors. Then, generate a message in case the API response, content or other error happens.
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

    // 2.d Define the arrays where the data from the API will be pushed. Then connect to https://covid-api.mmediagroup.fr/v1/history?country={country}&status=confirmed
    ConfirmedCasesDates()
    let dataDates = []
    let numCases = []
    let increments = []

    // 2.d.1 Connect to the API and define response and content variables
    async function ConfirmedCasesDates() {
        try{
            casesLineChartMesg.style.display = "none"// ensure that the error message doesn't get displayed in case of non-error
            const response = await fetch(`${urlConfirmed}${search}&status=confirmed`)
            const content = await response.json()
            const entries = Object.entries(content.All.dates)
            reduceArray(entries)
            entries.reverse() //reverse data to organise data from earliest to latest case

            //2.d.2 Loop the object entries and get total cases per day. To get specific num of cases per day,  push to increments the current total num of cases minus the previous total num. of cases. 
            for (let i = 1; i < entries.length; i++) {
                const [date, value] = entries[i]
                const [nextDate, previousValue] = entries[i - 1] ?? entries[i]
                dataDates.push(date)
                numCases.push(value)
                increments.push(value - previousValue)

            }
            //2.d.3 Get the last update of the data
            let update = dataDates[dataDates.length - 1] 

            //Define newCases. Last index of increments = num. of new cases
            let newCases = increments[increments.length - 1]
            // Print the data into the DOM 
            infoUpdated.innerHTML = reverseDate(update)
            newCasesInfo.innerHTML = newCases

            // Test data
            // console.log(dataDates)
            // console.log(numCases)
            // console.log(increments)
            // console.log(update)
            // console.log(newCases)

        //2.d.4 Set up a line chart using dataDates and increments arrays
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
            // 2.d.5 Define possible errors. Then, generate a message in case the API response, content u other error happens
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

    // 2.e Define the arrays where the data from the API will be pushed. Then connect to https://covid-api.mmediagroup.fr/v1/history?country={country}&status=deaths
    let deathDates = []
    let lastDeaths = []
    ConfirmedDeaths()
    async function ConfirmedDeaths() {
        try{

            // 2.e.1 Define response and content variables and loop the extracted data from the API. Then push the data into the arrays.
            
            deathsLineChartMesg.style.display = "none" // ensure that the error message doesn't get displayed in case of non-error
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
            // Test data
            // console.log(lastDeaths)
            // console.log(lastDeathcase)
            // console.log(deathDates)

            // 2.e.2 Set up a line chart using deathDates and lastDeaths arrays
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
            // 2.e.3 Define the possible errors. Then, generate a message in case the API response, content u other error happens
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



// 3. Custom functions

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
        flagImage.src = `./flags/32/_unknown.png`
        return flagImage
    }else{
        flagImage.src = `./flags/32/${abb}.png`
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
//Clear line chart 2
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





