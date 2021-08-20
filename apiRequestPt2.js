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
function extractLongitude(postcodeInfo) {
    longitude = postcodeInfo.result.longitude
    return longitude;
}

function extractLatitude(postcodeInfo) {
    latitude = postcodeInfo.result.latitude
    return latitude;
}

function getBusStops(postcodeInfo) {
    const latitude = extractLatitude(postcodeInfo);
    const longitude = extractLongitude(postcodeInfo);

    fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=${latitude}&lon=${longitude}&modes=bus`)
        .then(extractJsonFromResponse)
        .then(getStopID)
}

function getStopID(busStopInfo){
    const numOfBusStops = 2
    const busNumbers = []
    for(i=0; i<numOfBusStops; i++){
       const busArr = []
        busArr.push(busStopInfo.stopPoints[i].id)
        busArr.push(busStopInfo.stopPoints[i].commonName) 
        busNumbers.push(busArr)
    }
    
console.log(busNumbers)

}

function extractJsonFromResponse(response) {
    return response.json();
}

getPostcode('Please enter a postcode:');


// call postcode and bus API's
// print line number, destination, time to arrival (in minutes not seconds)

