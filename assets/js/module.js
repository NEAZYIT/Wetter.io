/**
 * @file Provides utility functions related to date and time handling.
 * @module DateUtils
 */

"use strict";

/**
 * Array containing the names of the days of the week.
 * @type {string[]}
 * @constant
 */
export const weekDayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

/**
 * Array containing the abbreviated names of the months.
 * @type {string[]}
 * @constant
 */
export const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

/**
 * Function to format a Unix timestamp and timezone offset into a formatted date string.
 * @function
 * @param {number} dateUnix - Unix timestamp representing the date.
 * @param {number} timezone - Timezone offset in seconds.
 * @returns {string} - Formatted date string (e.g., "Thursday 17, Feb").
 */
export const getDate = function (dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
}

/**
 * Function to format a Unix timestamp and timezone offset into a formatted time string.
 * @function
 * @param {number} timeUnix - Unix timestamp representing the time.
 * @param {number} timezone - Timezone offset in seconds.
 * @returns {string} - Formatted time string (e.g., "11:30 AM").
 */
export const getTime = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) {
        hours -= 12;
    }

    return `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
}

/**
 * Function to format a Unix timestamp and timezone offset into a formatted hours string.
 * @function
 * @param {number} timeUnix - Unix timestamp representing the time.
 * @param {number} timezone - Timezone offset in seconds.
 * @returns {string} - Formatted hours string (e.g., "11 PM").
 */
export const getHours = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    let hours = date.getUTCHours();
    const period = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) {
        hours -= 12;
    }

    return `${hours % 12 || 12} ${period}`;
}

/**
 * Function to convert meters per second (mps) to kilometers per hour (km/h).
 * @function
 * @param {number} mps - Speed in meters per second.
 * @returns {number} - Speed in kilometers per hour.
 */
export const mps_to_kmh = mps => {
    const kmh = mps * 3600 / 1000;
    return kmh;
}

/**
 * Object containing the AQI text descriptions.
 * @type {Object}
 * @constant
 */
export const aqiText = {
    1: {
        level: "Good",
        message: "Air quality is considered satisfactory, and air pollution poses little or no risk."
    },
    2: {
        level: "Fair",
        message: "Air quality is acceptable; however, there may be some pollutants that pose a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
    },
    3: {
        level: "Moderate",
        message: "Air quality is acceptable; however, there may be some pollutants that pose a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
    },
    4: {
        level: "Poor",
        message: "Members of sensitive groups may experience health effects. The general public is less likely to be affected."
    },
    5: {
        level: "Very Poor",
        message: "Health alert: everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
    }
};