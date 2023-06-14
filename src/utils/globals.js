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
 * URL of the users/{id} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const SINGLE_USER_URL = USERS_URL + '/{id}';

/**
 * URL of the users/login endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const LOGIN_URL = USERS_URL + '/login';

/**
 * URL of the users/signup endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const SIGNUP_URL = USERS_URL + '/signup';

/**
 * URL of the users/confirm/{confirmToken} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const CONFIRM_URL = USERS_URL + '/confirm/{confirmToken}';

/**
 * URL of the users/check-password endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const CHECK_PASSWORD_URL = USERS_URL + '/check-password';

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
 * URL of the users endpoint (including the query variables)
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const MEMBERS_URL =
  USERS_URL +
  '?sort=lastname,firstname&fields=username,firstname,lastname,photo&page={page}&limit={limit}';

/**
 * URL of the users/contacts endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const CONTACTS_URL = USERS_URL + '/contacts';

/**
 * URL of the users/contacts/{id} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const CONTACTS_WITH_ID_URL = CONTACTS_URL + '/{id}';

/**
 * URL of the users/invitations endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const INVITATIONS_URL = USERS_URL + '/invitations';

/**
 * URL of the users/invite endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const INVITE_URL = CONTACTS_WITH_ID_URL + '/invite';

/**
 * URL of the users/decline endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const DECLINE_INVITATION_URL = CONTACTS_WITH_ID_URL + '/decline';

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
 * URL of the events/today endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const TODAY_EVENTS_URL = EVENTS_URL + '/today';
/**
 * URL of the events/{id} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const SINGLE_EVENT_URL = EVENTS_URL + '/{id}';

/**
 * URL of the events/{id}/accept endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const ACCEPT_EVENT_URL = SINGLE_EVENT_URL + '/accept';

/**
 * URL of the events/{id}/decline endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const DECLINE_EVENT_URL = SINGLE_EVENT_URL + '/refuse';

/**
 * URL of the events/week/{date} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const WEEKLY_EVENTS_URL = EVENTS_URL + '/week/{date}';

/**
 * URL of the events/month/{date} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const MONTHLY_EVENTS_URL = EVENTS_URL + '/month/{date}';

/**
 * URL of the events/year/{date} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const YEARLY_EVENTS_URL = EVENTS_URL + '/year/{date}';

/**
 * URL of the task ressource in the backend
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const TASKS_URL = API_URL + '/tasks';

/**
 * URL of the tasks/{id} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const SINGLE_TASK_URL = TASKS_URL + '/{id}';

/**
 * URL of the tasks/{id}/complete endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const COMPLETE_TASK_URL = SINGLE_TASK_URL + '/complete';

/**
 * URL of the tasks/{id}/validate endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const VALIDATE_TASK_URL = SINGLE_TASK_URL + '/validate';

/**
 * URL of the tasks/students endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const STUDENTS_TASKS_URL = TASKS_URL + '/students';

/**
 * URL of the tasks/students/{userId} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const SINGLE_STUDENT_TASKS_URL = STUDENTS_TASKS_URL + '/{userId}';

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

/**
 * URL of the teaching demand ressource in the backend
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const TEACHING_DEMANDS_URL = API_URL + '/teaching-demands';

/**
 * URL of the teaching-demands/available-teachers endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const AVAILABLE_TEACHERS_URL =
  TEACHING_DEMANDS_URL + '/available-teachers';

/**
 * URL of the teaching-demands/{id} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const SINGLE_TEACHING_DEMAND_URL = TEACHING_DEMANDS_URL + '/{id}';

/**
 * URL of the teaching-demands/{id}/accept endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const ACCEPT_DEMAND_URL = SINGLE_TEACHING_DEMAND_URL + '/accept';

/**
 * URL of the teaching-demands/{id}/cancel endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const CANCEL_DEMAND_URL = SINGLE_TEACHING_DEMAND_URL + '/cancel';

/**
 * URL of the teaching-demands/user/{userId} endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const SEND_TEACHING_DEMAND_URL = TEACHING_DEMANDS_URL + '/user/{userId}';

/**
 * URL of the teaching-demands/is-supervised endpoint
 * @type {string}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const SUPERVISED_STATUS_URL = TEACHING_DEMANDS_URL + '/is-supervised';

/**
 * Array containing two-letters abbreviations for each day of the week
 * @type {string[]}
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
