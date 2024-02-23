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
                }
            });
        }, searchTimeoutDuration);
    }
});