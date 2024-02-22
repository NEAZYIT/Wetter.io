'use strict';

/**
 * Weather App API Key.
 * @type {string}
 */
const api_key = "40b536dfeb8f85c649328ef5f357a9e0";

/**
 * Fetches weather data from the specified API URL using the provided callback.
 * @param {string} URL - The API URL to fetch weather data.
 * @param {Function} callback - The callback function to handle the fetched data.
 */
export const fetchData = function (URL, callback) {
    /**
     * Fetches data from the API and processes it using the provided callback.
     * @param {Response} res - The response object from the fetch operation.
     * @returns {Promise} - A Promise representing the JSON data from the response.
     */
    fetch(`${URL}&appid=${api_key}`)
        .then(res => res.json())
        .then(data => callback(data));
}


/**
 * Object containing functions to generate OpenWeatherMap API URLs for different weather-related data.
 * @namespace
 * @property {Function} currentWeather - Generates the URL for current weather data based on latitude and longitude.
 * @property {Function} forecast - Generates the URL for weather forecast data based on latitude and longitude.
 * @property {Function} airPollution - Generates the URL for air pollution data based on latitude and longitude.
 * @property {Function} reverseGeo - Generates the URL for reverse geocoding based on latitude and longitude.
 * @property {Function} geo - Generates the URL for forward geocoding based on a query string.
 */
export const url = {
    /**
     * Generates the URL for current weather data based on latitude and longitude.
     * @param {string} lat - The latitude coordinate.
     * @param {string} lon - The longitude coordinate.
     * @returns {string} - The generated API URL for current weather.
     */
    currentWeather(lat, lon) {
        return 'https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric'
    },

    /**
     * Generates the URL for weather forecast data based on latitude and longitude.
     * @param {string} lat - The latitude coordinate.
     * @param {string} lon - The longitude coordinate.
     * @returns {string} - The generated API URL for weather forecast.
     */
    forecast(lat, lon) {
        return 'https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric'
    },

    /**
    * Generates the URL for air pollution data based on latitude and longitude.
    * @param {string} lat - The latitude coordinate.
    * @param {string} lon - The longitude coordinate.
    * @returns {string} - The generated API URL for air pollution data.
    */
    airPollution(lat, lon) {
        return 'http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}'
    },

    /**
     * Generates the URL for reverse geocoding based on latitude and longitude.
     * @param {string} lat - The latitude coordinate.
     * @param {string} lon - The longitude coordinate.
     * @returns {string} - The generated API URL for reverse geocoding.
     */
    reverseGeo(lat, lon) {
        return 'http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5'
    },

    /**
     * Generates the URL for forward geocoding based on a query string.
     * @param {string} query - The query string for location.
     * @returns {string} - The generated API URL for forward geocoding.
     */
    geo(query) {
        return 'http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5'
    }
}