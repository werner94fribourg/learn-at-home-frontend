/**
 * Store of all global helper functions used in the application
 * @module helpers
 */
import { BACKEND_URL } from './globals';
import moment from 'moment-timezone';
import { io } from 'socket.io-client';

/**
 * Function used to format a given time relative to the actual time
 * @param {Moment} sentTime the time we want to format
 * @returns {[string, number]} a formatted version of the time we just passed and the timer time in which the formatted date should be regenerated
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const generateDisplayedTime = sentTime => {
  const now = moment(Date.now()).tz('Europe/Zurich');

  let diff = now.diff(sentTime, 'seconds');

  if (diff < 60) {
    return ['Now', 60 * 1000];
  }

  diff = now.diff(sentTime, 'minutes');

  if (diff < 60) return [`${diff} minutes ago`, 60 * 1000];

  diff = now.diff(sentTime, 'hours');

  if (diff < 24) return [`${diff} hours ago`, 60 * 60 * 1000];

  diff = now.diff(sentTime, 'days');

  if (diff === 1)
    return [`Yesterday at ${sentTime.format('HH:mm')}`, 24 * 60 * 60 * 1000];

  return [sentTime.format('DD.MM.YYYY [at] HH:mm'), -1];
};

/**
 * Socket connection to the backend
 * @type {Socket}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
let SOCKET = null;

/**
 * Function used to retrieve the socket connection of the application
 * @returns {Socket} the socket connection object
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getSocket = () => SOCKET;

/**
 * Function used to set the socket connection to the server
 * @param {string} userId the id of the connected user for which we want to create a socket connection
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const setSocket = userId => {
  SOCKET = io.connect(BACKEND_URL, { query: `userId=${userId}` });
};

/**
 * Function used to delete the socket connection of the application
 * @returns {Socket} the socket connection object
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const resetSocket = () => {
  SOCKET = null;
};

/**
 * Function used to generate a response object when an unknow error happens in the application
 * @returns {Object} the generated response object in case where an unknown error happens in the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getUnknowErrorObject = () => {
  return {
    valid: false,
    authorized: false,
    message: 'An unknow error happened. Try again later.',
  };
};

/**
 * Function used to generate a response object when an error status code is sent back by the server
 * @param {number} status the status code of the response
 * @param {string} message the error message sent back by the server
 * @returns {Object} the generated response object in case an error status code is sent back by the server
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getErrorObject = (status, message) => {
  return {
    valid: false,
    authorized: status !== 401 && status !== 403,
    message,
  };
};

/**
 * Function used to make an API Call to a specific url in the backend
 * @param {string} url the url of the endpoint to which we want to make the API call
 * @param {Object} fetchObj the request parameters used to make the API call
 * @param {Function} returnData the handler function used to return the data when successfully retrieving it from the API
 * @param {number} code the status code of the response in case it successfully retrieves it (200 by default)
 * @returns {Promise<Object>} a promise returning a response object data depending on the success of the API Call
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const makeApiCall = async (url, fetchObj, returnData, code = 200) => {
  try {
    const response = await fetch(url, fetchObj);

    const { status } = response;

    const data = await response.json();

    if (status === code) return returnData(data);

    const { message } = data;
    return getErrorObject(status, message);
  } catch (err) {
    return getUnknowErrorObject();
  }
};
