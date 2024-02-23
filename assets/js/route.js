/**
 * @file Defines the main routing logic for the weather application.
 * @module Router
 */

'use strict';

import { updateWeather, error404 } from "./app.js";

/**
 * Default location URL when geolocation is not available.
 * @constant {string}
 */
const defaultLocation = "#/weather?lat=51.5073219&lon=-0.1276474";

/**
 * Function to fetch weather information based on the user's current location using geolocation API.
 * @function
 */
const fetchWeatherByCurrentLocation = function () {
    window.navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            updateWeather(`lat=${latitude}`, `lon=${longitude}`);
        },
        (error) => {
            console.error("Geolocation error:", error);
            window.location.hash = defaultLocation;
        }
    );
}

/**
 * Function to fetch weather information based on the searched location query.
 * @function
 * @param {string} query - Location query string.
 */
const fetchWeatherBySearchedLocation = (query) => updateWeather(...query.split("&"));

/**
 * Map containing route handlers for different URLs.
 * @constant {Map}
 */
const routes = new Map([
    ["/current-location", fetchWeatherByCurrentLocation],
    ["/weather", fetchWeatherBySearchedLocation],
]);

/**
 * Function to check and handle the hash change event.
 * @function
 */
const checkHash = function () {
    const requestURL = window.location.hash.slice(1);

    const [route, query] = requestURL.includes("?") ? requestURL.split("?") : [requestURL];

    const routeHandler = routes.get(route);

    if (routeHandler) {
        routeHandler(query);
    } else {
        error404();
    }
}

// Event listener for hash change
window.addEventListener("hashchange", checkHash);

// Event listener for page load
window.addEventListener("load", function () {
    // Set the default location if the hash is not present
    if (!window.location.hash) {
        window.location.hash = "#/current-location";
    } else {
        checkHash();
    }
});