/**
 * Store of all global parameters used in the application.
 * @module globals
 */

/**
 * Base URL of the backend
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const BACKEND_URL = 'https://api-learn-at-home.herokuapp.com';

/**
 * Base URL of the backend API
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const API_URL = BACKEND_URL + '/api/v1';

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
 * URL of the users/login endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const LOGIN_URL = USERS_URL + '/login';

/**
 * URL of the users/me endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const ME_URL = USERS_URL + '/me';

/**
 * URL of the users/supervised endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const SUPERVISED_STUDENTS_URL = USERS_URL + '/supervised';

/**
 * URL of the users/{id}/status endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const STATUS_URL = USERS_URL + '/{id}/status';

/**
 * URL of the message ressource in the backend
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const MESSAGES_URL = API_URL + '/messages';

/**
 * URL of the messages/last endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const LAST_URL = MESSAGES_URL + '/last';

/**
 * URL of the messages/last/{id} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const LAST_WITH_ID_URL = LAST_URL + '/{id}';

/**
 * URL of the messages/unread endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const UNREAD_URL = MESSAGES_URL + '/unread';

/**
 * URL of the messages/unread/{id} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const UNREAD_WITH_ID_URL = UNREAD_URL + '/{id}';

/**
 * URL of the messages/conversation endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const CONVERSATION_URL = MESSAGES_URL + '/conversation';

/**
 * URL of the messages/conversation/{id} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const CONVERSATION_WITH_ID_URL = CONVERSATION_URL + '/{id}';

/**
 * URL of the messages/{id}/read endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const READ_URL = MESSAGES_URL + '/{id}/read';

/**
 * URL of the event ressource in the backend
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const EVENTS_URL = API_URL + '/events';

/**
 * URL of the task ressource in the backend
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const TASKS_URL = API_URL + '/tasks';

/**
 * URL of the tasks/students endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const STUDENTS_TASKS_URL = TASKS_URL + '/students';

/**
 * URL of the tasks/students/validated endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const VALIDATED_STUDENTS_TASKS_URL = STUDENTS_TASKS_URL + '/validated';

/**
 * URL of the tasks/students/done endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const DONE_STUDENTS_TASKS_URL = STUDENTS_TASKS_URL + '/done';

/**
 * URL of the tasks/students/todo endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const TODO_STUDENTS_TASKS_URL = STUDENTS_TASKS_URL + '/todo';
