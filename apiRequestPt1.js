const fetch = require('node-fetch');
const stopNumber = '490008660N'

function sortBusArray(busArr) {
    return busArr.sort((a, b) => a.timeToStation - b.timeToStation)
}

function printInfoAboutBuses(busArr) {
    const sortedbusArr = sortBusArray(busArr)

    console.log('Buses Due:') 

    for (const bus in sortedbusArr) {       
        if ([bus] < 5)
        console.log(
            `Bus ${sortedbusArr[bus].lineId} is due in ${Math.ceil(sortedbusArr[bus].timeToStation / 60)} minutes`)
    }
}

function extractJsonFromResponse(response) {
    return response.json();
}

fetch(`https://api.tfl.gov.uk/StopPoint/${stopNumber}/Arrivals?app_key=697968f7487e4271b29e648c72016a69`)
    .then(extractJsonFromResponse)
    .then(printInfoAboutBuses);


