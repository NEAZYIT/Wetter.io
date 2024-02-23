/**
 * @file Defines the search functionality and integration with the weather application.
 * @module Search
 */

'use strict';

import { fetchData, url } from "./api.js";

/**
 * Adds an event listener to a collection of elements.
 * @function
 * @param {NodeList} elements - Collection of DOM elements.
 * @param {string} eventType - Type of event to listen for (e.g., "click").
 * @param {Function} callback - Callback function to be executed on the event.
 */
const addEventToElements = function (elements, eventType, callback) {
    for (const element of elements) element.addEventListener(eventType, callback);
}

/**
 * DOM element representing the search view.
 * @constant {HTMLElement}
 */
const searchView = document.querySelector("[data-search-view]");

/**
 * Collection of DOM elements representing search toggler buttons.
 * @constant {NodeList}
 */
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

/**
 * Toggles the visibility of the search view.
 * @function
 */
const toggleSearch = () => searchView.classList.toggle("active");

// Event delegation: Adds click event to search toggler buttons
addEventToElements(searchTogglers, "click", toggleSearch);

/**
 * DOM element representing the search field.
 * @constant {HTMLInputElement}
 */
const searchField = document.querySelector("[data-search-field]");

/**
 * DOM element representing the search result container.
 * @constant {HTMLElement}
 */
const searchResult = document.querySelector("[data-search-result]");

/**
 * Holds the timeout ID for delaying search requests.
 * @type {number|null}
 */
let searchTimeout = null;

/**
 * Duration for which to wait before making a search request after user input.
 * @constant {number}
 */
const searchTimeoutDuration = 500;

// Event listener for search field input
searchField.addEventListener("input", function () {
    // Clear previous timeout
    searchTimeout && clearTimeout(searchTimeout);

    if (!searchField.value) {
        // Reset search result container when search field is empty
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchField.classList.remove("searching");
    } else {
        searchField.classList.add("searching");
    }

    if (searchField.value) {
        // Set a timeout to delay the search request
        searchTimeout = setTimeout(() => {
            fetchData(url.geo(searchField.value), function (locations) {
                searchField.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML = `<ul class="view-list" data-search-list></ul>`;

                const items = [];

                // Populate search result container with location items
                for (const { name, lat, lon, country, state } of locations) {
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");
                    searchItem.innerHTML = `
                        <span class="m-icone">location_on</span>
                        <!-- Item Details -->
                        <div>
                            <p class="item-title">${name}</p>
                            <p class="label-2 item-subtitle">${state || ""} ${country}</p>
                        </div>
                        <!-- Item Link -->
                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>`;

                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"));
                }

                addEventToElements(items, "click", function () {
                    toggleSearch();
                    searchResult.classList.remove("active");
                })
            });
        }, searchTimeoutDuration);
    }
});

/**
 * DOM element representing the main container.
 * @constant {HTMLElement}
 */
const container = document.querySelector("[data-container]");

/**
 * DOM element representing the loading indicator.
 * @constant {HTMLElement}
 */
const loading = document.querySelector("[data-loading]");

/**
 * DOM element representing the button for fetching current location weather.
 * @constant {HTMLButtonElement}
 */
const currentLocationBtn = document.querySelector("[data-current-location-btn]");

/**
 * DOM element representing the error content container.
 * @constant {HTMLElement}
 */
const errorContent = document.querySelector("[data-error-content]");

/**
 * Updates the weather information based on the provided latitude and longitude.
 * @function
 * @param {number} lat - Latitude information for weather location.
 * @param {number} lon - Longitude information for weather location.
 */
export const updateWeather = function (lat, lon) {
    // Show loading indicator
    /* loading.style.display = "grid"; */

    // Hide vertical overflow on the main container
    container.style.overflowY = "hidden";

    // Remove 'fade-in' class from the main container if it exists
    container.classList.contains("fade-in") ?? container.classList.remove("fade-in");

    // Hide error content
    errorContent.style.display = "none";

    /**
    * DOM element representing the current weather section.
    * @constant {HTMLElement}
    */
    const currentWeatherSection = document.querySelector("[data-current-weather]");

    /**
     * DOM element representing the highlights section.
     * @constant {HTMLElement}
     */
    const highlightSection = document.querySelector("[data-highlights]");

    /**
     * DOM element representing the hourly forecast section.
     * @constant {HTMLElement}
     */
    const hourlySection = document.querySelector("[data-hourly-forecast]");

    /**
     * DOM element representing the 5-day forecast section.
     * @constant {HTMLElement}
     */
    const forecastSection = document.querySelector("[data-5-day-forecast]");

    // Clear the existing content of each section
    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
    hourlySection.innerHTML = "";
    forecastSection.innerHTML = "";

    /**
     * Checks the window location hash and updates the current location button's attribute.
     * @constant {HTMLButtonElement}
     */
    if (window.location.hash === "#/current-location") {
        currentLocationBtn.setAttribute("disabled", "");
    } else {
        currentLocationBtn.removeAttribute("disabled");
    }

    /* Current Weather Section */
    fetchData(url.currentWeather(lat, lon), function (currentWeather) {
        const {
            weather,
            dt: dateUnix,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
            main: { temp, feel_like, pressure, humidity },
            visibility,
            timezone
        } = currentWeather
        const [{ description, icon }] = weather;

        const card = document.createElement("div");
        card.classList.add("card", "card-lg", "current-weather-card");

        card.innerHTML = `
            <h2 class="title-2 card-title">Now</h2>
            <div class="weapper">
                <p class="heading">${parseInt(temp)}&deg;<sup>C</sup></p>
                <img src="/assets/images/icons/${icon}.png" width="64" height="64" alt="${description}" class="weather-icon">
            </div>
            <p class="body-3">${description}</p>
            <ul class="meta-list">
                <li class="meta-item">
                    <span class="m-icone">Calendar_today</span>
                    <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
                </li>
                <li class="meta-item">
                    <span class="m-icone">location_on</span>
                    <p class="title-3 meta-text" data-location></p>
                </li>
            </ul>
        `;

        fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
            card.querySelector("[data-location]").setAttribute("data-location", `${name}, ${country}`);
        });

        // Append the card to the currentWeatherSection
        console.log("Before appending card");
        currentWeatherSection.appendChild(card);
        console.log("After appending card");
    });
}

/* export const error404 = function () { } */