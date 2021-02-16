const express = require('express');
const createError = require('http-errors');

const router = express.Router();
const esService = require('../elasticsearch/es-service');
const EarthquakeService = require('../services/earthquake-service');

router.get('/', async (req, res) => {

    EarthquakeService.getEarthquakes().then((result) => {
        res.json(result);

    }).catch((err) => {
        console.log(err);
        res.status(err.status).json(createError(err.status));

    });

});
router.get('/limit/:limit(\\d+)', async (req, res) => {
    let earthquakes = [];

    EarthquakeService.getEarthquakes().then((result) => {
        earthquakes.copyWithin(result)
        res.json(earthquakes.splice(0, req.params.limit));
    }).catch((err) => {
        console.log(err);
        res.status(400).json(createError(400));

    });



});
router.get('/filterByLocation', async (req, res) => {

    EarthquakeService.getEarthquakes().then(async () => {

        let searchResult = await esService.searchByLocation("earthquakes", req.query.lat, req.query.lon, req.query.size, req.query.radius);
        let earthquakesArr = [];

        searchResult.hits.hits.forEach(element => { earthquakesArr.push(element._source); });

        res.json(earthquakesArr);
        
    }).catch((err) => {
        console.log(err);
        res.status(err.status).send(createError(err.status));
    });

});
router.get('/filterByMag', async (req, res) => {

    EarthquakeService.getEarthquakes().then(async () => {

        let searchResult = await esService.searchByMag("earthquakes", req.query.mag, req.query.size);
        let earthquakesArr = [];

        searchResult.hits.hits.forEach(element => { earthquakesArr.push(element._source); });

        res.json(earthquakesArr);

    }).catch((err) => {
        console.log(err);
        res.status(err.status).send(createError(err.status));

    });

});

router.get('/filterByDate', async (req, res) => {

    EarthquakeService.getEarthquakes().then(async (result) => {

        let searchResult = await esService.searchByDate("earthquakes", req.query.start, req.query.end, req.query.size);
        let earthquakesArr = [];

        searchResult.hits.hits.forEach(element => { earthquakesArr.push(element._source); });

        res.json(earthquakesArr);
    }).catch((err) => {
        console.log(err);
        res.status(err.status).send(createError(err.status));

    });

});

module.exports = router;
