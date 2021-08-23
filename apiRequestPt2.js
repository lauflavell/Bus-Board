const fetch = require('node-fetch');
const readline = require('readline-sync');

function promptUser(promptString){
    console.log(`\n ${promptString}`);
    return readline.prompt()
}

function extractJsonFromResponse(response) {
    return response.json();
}

function getPostcode(promptString) {
    const postcode = promptUser(promptString)

    fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(checkResponseOk)
    .then(getBusStops,invalidPostcode)

}
function checkResponseOk(response) {
    if (response.ok) {
        return extractJsonFromResponse(response);
       
     } else {
         throw "Invalid Postcode"
     }
}

function invalidPostcode() {
    getPostcode("Invalid Postcode, Please enter valid postcode")
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
    const radius = 1000;
    const latitude = extractLatitude(postcodeInfo);
    const longitude = extractLongitude(postcodeInfo);

    fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=${latitude}&lon=${longitude}&radius=${radius}&modes=bus`)
        .then(extractJsonFromResponse)
        .then(checkIfBusStopsNear)
        .then(getStopID, noAvailableBusStops)
}

function checkIfBusStopsNear(response){
   if(response.stopPoints.length === 0){
        throw "Error, No BusStop ID's"
    } else {
        return response
    }
}

function noAvailableBusStops(){
    getPostcode("No Bus stop within 1km, Please enter another postcode")
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

function getBuses(busNumbers) {
    for (let i = 0; i < busNumbers.length; i++) {
        let stopNumber = busNumbers[i][0]

    fetch(`https://api.tfl.gov.uk/StopPoint/${stopNumber}/Arrivals?app_key=697968f7487e4271b29e648c72016a69`)
    .then(extractJsonFromResponse)
    .then(checkIfThereAreBuses)
    .then(nextFiveBuses,noBuses);   
    }
}

function checkIfThereAreBuses(response){ 
    if (response.length === 0) {
        throw'error, no buses'
    } else {
        return response;
    }
}

function noBuses() {
    console.log('There are no buses available');
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
            `${sortedbusArr[bus].lineId} going to ${sortedbusArr[bus].destinationName}, arriving in ${Math.ceil(sortedbusArr[bus].timeToStation / 60)} minutes`)
    }
}

getPostcode('Please enter a postcode:');


