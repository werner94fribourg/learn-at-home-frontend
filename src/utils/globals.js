/**
 * Store of all global parameters used in the application.
 * @module globals
 */

/**
 * Base URL of the backend API
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const API_URL = 'https://api-learn-at-home.herokuapp.com/api/v1';

/**
 * Base URL of the frontend
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const SITE_URL = 'http://localhost:3000';

/**
 * URL of the user ressource in the backend
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const USERS_URL = API_URL + '/users';

/**
 * URL of the login endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const LOGIN_URL = USERS_URL + '/login';
