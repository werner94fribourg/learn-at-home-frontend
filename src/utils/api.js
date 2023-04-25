/**
 * Store of all global helper functions used in the application
 * @module helpers
 */
import {
  DONE_STUDENTS_TASKS_URL,
  EVENTS_URL,
  LOGIN_URL,
  ME_URL,
  SUPERVISED_STUDENTS_URL,
  TASKS_URL,
  TODO_STUDENTS_TASKS_URL,
  UNREAD_URL,
  VALIDATED_STUDENTS_TASKS_URL,
} from './globals';

/**
 * Function used to log the user into the application by calling the backend
 * @param {Object} credentials the credential object used to log into the application (i.e. username and password)
 * @returns {Promise<Object>} a promise containing the response retrieved from the login attempt
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const login = async credentials => {
  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    const { status } = response;

    const data = await response.json();

    if (status === 200) {
      const { token } = data;
      return { valid: true, token };
    }

    const { message } = data;
    return { valid: false, message };
  } catch (err) {
    return {
      valid: false,
      message: 'An unknow error happened. Try again later.',
    };
  }
};

/**
 * Function used to retrieve the informations of the connected user (name, username, ...)
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the data of the connected user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getConnectedUser = async token => {
  try {
    const response = await fetch(ME_URL, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const { status } = response;

    const data = await response.json();

    if (status === 200) {
      return { valid: true, authorized: true, me: data.data.user };
    }

    const { message } = data;
    return {
      valid: false,
      authorized: status === 401 && status >= 403,
      message,
    };
  } catch (err) {
    return {
      valid: false,
      authorized: true,
      message: 'An unknow error happened. Try again later.',
    };
  }
};

/**
 * Function used to get the total number of unread messages for a connected user
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the number of unread messages of the connected user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getTotalUnreadMessages = async token => {
  try {
    const response = await fetch(UNREAD_URL, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const { status } = response;

    const data = await response.json();

    if (status === 200) {
      const { data: countData } = data;

      return {
        valid: true,
        authorized: true,
        count: countData?.unread?.count || 0,
      };
    }

    const { message } = data;
    return {
      valid: false,
      authorized: status === 401 && status === 403,
      message,
    };
  } catch {
    return {
      valid: false,
      authorized: true,
      message: 'An unknow error happened. Try again later.',
    };
  }
};

/**
 * The params of the getEvents function
 * @typedef EventsParams
 * @property {string} token the jwt token of the logged user
 * @property {number} page the page number we want to retrieve
 * @property {number} limit the number of elements per page we want to retrieve
 */

/**
 * Function used to retrieve the events of the user
 * @param {Object<EventsParams>} eventsParams the parameter object of the function
 * @returns {Promise<Object>} a promise containing the events of the connected user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getEvents = async ({ token, page, limit }) => {
  try {
    const response = await fetch(`${EVENTS_URL}?page=${page}&limit=${limit}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const { status } = response;

    const data = await response.json();

    if (status === 200) {
      const {
        data: { events },
      } = data;

      return { valid: true, authorized: true, events };
    }

    const { message } = data;

    return {
      valid: false,
      authorized: status === 401 && status === 403,
      message,
    };
  } catch (err) {
    return {
      valid: false,
      authorized: true,
      message: 'An unknow error happened. Try again later.',
    };
  }
};

/**
 * Generic function used to retrieve tasks from the backend
 * @param {string} token the jwt token of the logged user
 * @param {string} url the url to which we want to retrieve the tasks
 * @returns {Promise<Object>} a promise containing the tasks asked by the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const getTasks = async (token, url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const { status } = response;

    const data = await response.json();

    if (status === 200) {
      const {
        data: { tasks },
      } = data;

      return { valid: true, authorized: true, tasks };
    }

    const { message } = data;

    return {
      valid: false,
      authorized: status === 401 && status === 403,
      message,
    };
  } catch {
    return {
      valid: false,
      authorized: true,
      message: 'An unknow error happened. Try again later.',
    };
  }
};

/**
 * Function used to retrieve the own tasks of the connected user (students only)
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the tasks asked by the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getOwnTasks = async token => getTasks(token, TASKS_URL);

/**
 * Function used to retrieve the done tasks of the supervised students (teachers only)
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the tasks asked by the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getDoneStudentsTasks = async token =>
  getTasks(token, DONE_STUDENTS_TASKS_URL);

/**
 * Function used to retrieve the todo tasks of the supervised students (teachers only)
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the tasks asked by the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getTodoStudentsTasks = async token =>
  getTasks(token, TODO_STUDENTS_TASKS_URL);

/**
 * Function used to retrieve the validated tasks of the supervised students (teachers only)
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the tasks asked by the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getValidatedStudentsTasks = async token =>
  getTasks(token, VALIDATED_STUDENTS_TASKS_URL);

/**
 * The params of the getSupervisedStudents function
 * @typedef SupervisedParams
 * @property {string} token the jwt token of the logged user
 */

/**
 * Function used to retrieve the supervised students of the user (teachers only)
 * @param {Object<SupervisedParams>} supervisedParams the parameter object of the function
 * @returns {Promise<Object>} a promise containing the supervised students of the connected user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getSupervisedStudents = async ({ token }) => {
  try {
    const response = await fetch(SUPERVISED_STUDENTS_URL, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const { status } = response;

    const data = await response.json();

    if (status === 200) {
      const {
        data: { users },
      } = data;

      return { valid: true, authorized: true, users };
    }

    const { message } = data;

    return {
      valid: false,
      authorized: status === 401 && status === 403,
      message,
    };
  } catch {
    return {
      valid: false,
      authorized: true,
      message: 'An unknow error happened. Try again later.',
    };
  }
};
