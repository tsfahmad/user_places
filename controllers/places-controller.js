const { v4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'Some irrelevant data',
        location: {
            lat: 40.7484474,
            lng: -73.9871516,
        },
        address: 'Some random address',
        creator: 'u1'
    }
];

const getPlaceById =  (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find((p) => p.id === placeId);
    
    if(!place) {
        throw  new HttpError('Could not find a place with provided id', 404);
    }
    
    res.json({place});
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter((p) => p.creator === userId);
       
    if(places.length === 0) {
        return next(
            new HttpError('Could not find any place with provided user id', 404)
        );
    }
    
    res.json({places});
}

const createPlace = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json(errors);
    }

    const { title, description, coordinates, address, creator} = req.body;
    const createdPlace = {
        id: v4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    }

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace});
}

const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json(errors);
    }
    const placeId = req.params.pid;
    const { title, description, coordinates, address} = req.body;
    const place = DUMMY_PLACES.find((p) => p.id === placeId);
    
    if(!place) {
        throw  new HttpError('Could not find a place with provided id', 404);
    }
    
    place.title = title;
    place.description = description;
    place.address = address;
    place.location = coordinates;

    res.status(200).json({place}); 
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    const index = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    if(index > -1) {
        DUMMY_PLACES.splice(index, 1);
    }

    res.status(200).json({message: 'Deleted place.'});
}

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    updatePlace,
    deletePlace,
}