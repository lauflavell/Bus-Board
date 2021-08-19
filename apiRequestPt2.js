const fetch = require('node-fetch');
const stopNumber = '490008660N';
const postcode = 'SW20 8RD';

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
    const latitude = (extractLatitude(postcodeInfo));
    const longitude = (extractLongitude(postcodeInfo))

    fetch(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=${latitude}&lon=${longitude}&modes=bus`)
        .then(extractJsonFromResponse)
        .then(printBusStopInfo)

}

function printBusStopInfo(busStopInfo){
    console.log(busStopInfo)
}

function extractJsonFromResponse(response) {
    return response.json();
}

fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(extractJsonFromResponse)
    .then(getBusStops)


// call postcode and bus API's
// print line number, destination, time to arrival (in minutes not seconds)

