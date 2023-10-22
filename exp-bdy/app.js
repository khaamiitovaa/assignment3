const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Replace 'YOUR_OPENWEATHER_API_KEY' with your actual OpenWeatherAPI key.
const openWeatherApiKey = "9e9f59fe274055ffaa69589654eb7f41";
const openWeatherApiUrl = "http://api.openweathermap.org/data/2.5/weather";

// Replace 'YOUR_OTHER_API_KEY' with your actual API keys for the additional third-party APIs.

app.get("/", (req, res) => {
    res.render("index", { weatherData: null, error: null });
});

app.post("/weather", async (req, res) => {
    const { city } = req.body;
    const params = {
        q: city,
        appid: openWeatherApiKey,
        units: "metric", // Use metric units for temperature
    };

    try {
        const response = await axios.get(openWeatherApiUrl, { params });
        const weatherData = response.data;
        console.log(weatherData);

        // Extract the required weather information.
        const weatherInfo = {
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            coordinates: {
                latitude: weatherData.coord.lat,
                longitude: weatherData.coord.lon,
            },
            feelsLikeTemp: weatherData.main.feels_like,
            humidity: weatherData.main.humidity,
            pressure: weatherData.main.pressure,
            windSpeed: weatherData.wind.speed,
            countryCode: weatherData.sys.country,
            city: weatherData.name,
            rainVolumeLast3Hours: weatherData.rain ? weatherData.rain["3h"] : 0,
        };

        res.render("index", { weatherData: weatherInfo, error: null });
    } catch (error) {
        console.error(error);
        res.render("index", { weatherData: null, error: "City not found" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
