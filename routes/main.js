// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request');

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

// Weather Route
router.get('/weather', function(req, res, next) {
    res.render('weather.ejs');
});

router.get('/weather/result', function(req, res, next) {

    let apiKey = process.env.WEATHER_KEY;

    // Get city from input (or default to London)
    let city = req.sanitize(req.query.city) || 'london';

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {

        var weather = JSON.parse(body);    

        if (weather !== undefined && weather.main !== undefined) {
            var wmsg =
                'It is ' + weather.main.temp +
                ' degrees in ' + weather.name +
                '! <br>The humidity now is: ' +
                weather.main.humidity + '%' +
                '<br>The wind speed is: ' +
                weather.wind.speed + ' m/s' +
                '<br>However it feels like: ' +
                weather.main.feels_like + ' degrees' +
                '<br>Conditions: ' +
                weather.weather[0].description;

            res.send(wmsg);
        } else {
            res.send("No data found");
            }
        }
    });

});


// Export the router object so index.js can access it
module.exports = router