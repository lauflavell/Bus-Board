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
    .then(getBusStops, error)
    .catch(error)

}

function error(){
    promptUser("Incorrect postcode, please try again")
    getPostcode(promptString)
}

function getBuses(busNumbers) {
    for (let i = 0; i < busNumbers.length; i++) {
        let stopNumber = busNumbers[i][0]

    fetch(`https://api.tfl.gov.uk/StopPoint/${stopNumber}/Arrivals?app_key=697968f7487e4271b29e648c72016a69`)
    .then(extractJsonFromResponse)
    .then(nextFiveBuses);   
    }
}

function sortBusArray(busArr) {
    return busArr.sort((a, b) => a.timeToStation - b.timeToStation)
}

function nextFiveBuses(busArr) {
    const sortedbusArr = sortBusArray(busArr)
    console.log(`\nThe next bus to arrive at ${sortedbusArr[0].stationName} will be`)
    for (const bus in busArr) {       
        if ([bus] < 5)
        console.log(
            `Bus ${sortedbusArr[bus].lineId} going to ${sortedbusArr[bus].destinationName} is due in ${Math.ceil(sortedbusArr[bus].timeToStation / 60)} minutes`)
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
       const busStopArr = []
        busStopArr.push(busStopInfo.stopPoints[i].id)
        busStopArr.push(busStopInfo.stopPoints[i].commonName) 
        busNumbers.push(busStopArr)
    }
    
return getBuses(busNumbers)

}

function extractJsonFromResponse(response) {
    return response.json();
}

getPostcode('Please enter a postcode:');


// call postcode and bus API's
// print line number, destination, time to arrival (in minutes not seconds)

