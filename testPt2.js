const fetch = require('node-fetch');
const readline = require('readline-sync');
const stopNumber = '490008660N';

function promptUser(promptString){
    console.log(`\n ${promptString}`);
    return readline.prompt()
}

function getPostcode(promptString) {
    const postcode = promptUser(promptString)

    fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(extractJsonFromResponse)
    .then(getBusStops)

}

function nextFiveBuses(busArr) {
    busArr.sort(function (a, b) {
        return a.timeToStation - b.timeToStation
    });
    for (i = 0; i < 5; i++) {
        console.log("The next bus is the number " + busArr[i].lineId + " arriving in " + busArr[i].timeToStation + "seconds")
    }
}

function sortBusArray(busArr) {
    return busArr.sort((a, b) => a.timeToStation - b.timeToStation)

}

function getBusStops(postcodeInfo) {
    const latitude = postcodeInfo.result.latitude
    const longitude = postcodeInfo.result.longitude

    fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=${latitude}&lon=${longitude}&modes=bus`)
        .then(extractJsonFromResponse)
        .then(printBusStopInfo)

}

function printBusStopInfo(busStopInfo){
    const numOfBusStops = 2
    const busNumber = 
    console.log(busStopInfo)
}

function extractJsonFromResponse(response) {
    return response.json();
}

getPostcode('Please enter a postcode:');


// call postcode and bus API's
// print line number, destination, time to arrival (in minutes not seconds)

