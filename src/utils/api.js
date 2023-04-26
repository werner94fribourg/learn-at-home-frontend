/**
 * Store of all global api functions used in the application
 * @module api
 */
import {
  CONVERSATION_WITH_ID_URL,
  DONE_STUDENTS_TASKS_URL,
  EVENTS_URL,
  LAST_URL,
  LAST_WITH_ID_URL,
  LOGIN_URL,
  ME_URL,
  READ_URL,
  STATUS_URL,
  SUPERVISED_STUDENTS_URL,
  TASKS_URL,
  TODO_STUDENTS_TASKS_URL,
  UNREAD_URL,
  UNREAD_WITH_ID_URL,
  VALIDATED_STUDENTS_TASKS_URL,
} from './globals';
import { makeApiCall } from './utils';

/**
 * Function used to log the user into the application by calling the backend
 * @param {Object} credentials the credential object used to log into the application (i.e. username and password)
 * @returns {Promise<Object>} a promise containing the response retrieved from the login attempt
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const login = async credentials => {
  return makeApiCall(
    LOGIN_URL,
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    },
    data => {
      const { token } = data;
      return { valid: true, token };
    }
  );
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
  return makeApiCall(
    ME_URL,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      return { valid: true, authorized: true, me: data.data.user };
    }
  );
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
  return makeApiCall(
    UNREAD_URL,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const { data: countData } = data;

      return {
        valid: true,
        authorized: true,
        count: countData?.unread?.count || 0,
      };
    }
  );
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
  return makeApiCall(
    `${EVENTS_URL}?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { events },
      } = data;

      return { valid: true, authorized: true, events };
    }
  );
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
  return makeApiCall(
    url,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { tasks },
      } = data;

      return { valid: true, authorized: true, tasks };
    }
  );
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
  return makeApiCall(
    SUPERVISED_STUDENTS_URL,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { users },
      } = data;

      return { valid: true, authorized: true, users };
    }
  );
};

/**
 * Function used to retrieve, for each existing conversation, the last messages he received/sent to each user
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the last messages received/sent by the logged user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getLastMessages = async token => {
  return makeApiCall(
    LAST_URL,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { messages },
      } = data;

      return { valid: true, authorized: true, messages };
    }
  );
};

/**
 * Function used to retrieve the last message received/sent by the logged user to another one
 * @param {string} token the jwt token of the logged user
 * @param {string} userId the id of the user from which we want to retrieve the last message
 * @returns {Promise<Object>} a promise containing the last message received/sent by the logged user to a specific one
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getLastMessage = async (token, userId) => {
  return makeApiCall(
    LAST_WITH_ID_URL.replace('{id}', userId),
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { message },
      } = data;

      return { valid: true, authorized: true, message };
    }
  );
};

/**
 * Function used to get the number of unread message from a specific user
 * @param {string} token the jwt token of the logged user
 * @param {string} id the id of the user from which we want to know the number of unread messages
 * @returns {Promise<Object>} a promise containing the number of unread messages
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getUnread = async (token, id) => {
  return makeApiCall(
    UNREAD_WITH_ID_URL.replace('{id}', id),
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const { data: countData } = data;

      return {
        valid: true,
        authorized: true,
        count: countData?.unread?.count || 0,
      };
    }
  );
};

/**
 * Function used to get the messages from a conversation with a specific user
 * @param {string} token the jwt token of the logged user
 * @param {string} id the id of the user with whom we want to retrieve the conversation
 * @param {number} page the number of the page we want to retrieve
 * @param {number} limit the number of elements per page
 * @returns {Promise<Object>} a promise containing the messages from a conversation with a specific user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getConversation = async (token, id, page = 1, limit = 10) => {
  return makeApiCall(
    `${CONVERSATION_WITH_ID_URL.replace(
      '{id}',
      id
    )}?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': 'https://localhost:3000',
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { messages },
      } = data;

      return { valid: true, authorized: true, messages };
    }
  );
};

/**
 * Function used to read a specific message
 * @param {string} token the jwt token of the logged user
 * @param {string} messageId the id of the message we want to read
 * @returns {Promise<Object>} a promise containing the updated message we wanted to read
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const readMessage = async (token, messageId) => {
  return makeApiCall(
    READ_URL.replace('{id}', messageId),
    {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { message },
      } = data;

      return { valid: true, authorized: true, message };
    }
  );
};

/**
 * Function used to send a message to another user
 * @param {string} token the jwt token of the logged user
 * @param {string} id the id of the user to which we want to send a message
 * @param {string} content the content of the message we want to send
 * @returns {Promise<Object>} a promise containing the message we just sent
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const sendMessage = async (token, id, content) => {
  return makeApiCall(
    CONVERSATION_WITH_ID_URL.replace('{id}', id),
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ content }),
    },
    data => {
      const {
        data: { message },
      } = data;

      return { valid: true, authorized: true, message };
    },
    201
  );
};

/**
 * Function used to send a message (content and file) to another user
 * @param {string} token the jwt token of the logged user
 * @param {string} id the id of the user to which we want to send a message
 * @param {FormData} formData the data (content and file) we want to send to the other user
 * @returns {Promise<Object>} a promise containing the message (content and files) we just sent
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const sendMessageWithFiles = async (token, id, formData) => {
  return makeApiCall(
    CONVERSATION_WITH_ID_URL.replace('{id}', id),
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    },
    data => {
      const {
        data: { message },
      } = data;

      return { valid: true, authorized: true, message };
    },
    201
  );
};

/**
 * Function used to get the connection status of an user
 * @param {string} token the jwt token of the logged user
 * @param {string} userId the id of the user from which we want to retrieve the connection status
 * @returns {Promise<Object>} a promise containing the connection status of a specific user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getConnectionStatus = async (token, userId) => {
  return makeApiCall(
    STATUS_URL.replace('{id}', userId),
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { connected },
      } = data;

      return { valid: true, authorized: true, connected };
    }
  );
};
