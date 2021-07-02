const axios = require('axios');
const HttpError = require('../models/http-error');

async function getCoordsForAddress(address) {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
        )}&key=${process.env.API_KEY}`);
    const data = response.data;

    if(!data || data.status === 'ZERO_RESULTS') {
        throw new HttpError('Could not find location for the specified address', 422);
    } else if(data.status === 'REQUEST_DENIED') {
        console.log(data);
        console.log('Filling Dummy Data');
        return {
            lat: 45.1651651,
            lng: -75.151565,
        }
    }

    console.log(data);
    const coordinates = data.results[0].geometry.location;
    return coordinates;
}

module.exports = getCoordsForAddress;