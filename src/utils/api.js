/**
 * Store of all global api functions used in the application
 * @module api
 */
import {
  ACCEPT_EVENT_URL,
  COMPLETE_TASK_URL,
  DECLINE_EVENT_URL,
  MONTHLY_EVENTS_URL,
  SEND_TEACHING_DEMAND_URL,
  SINGLE_EVENT_URL,
  SINGLE_STUDENT_TASKS_URL,
  SUPERVISED_STATUS_URL,
  VALIDATE_TASK_URL,
  WEEKLY_EVENTS_URL,
  YEARLY_EVENTS_URL,
} from './globals';
import { USERS_URL } from './globals';
import {
  ACCEPT_DEMAND_URL,
  AVAILABLE_TEACHERS_URL,
  CANCEL_DEMAND_URL,
  CONTACTS_URL,
  CONTACTS_WITH_ID_URL,
  CONVERSATION_WITH_ID_URL,
  DECLINE_INVITATION_URL,
  DONE_STUDENTS_TASKS_URL,
  EVENTS_URL,
  INVITATIONS_URL,
  INVITE_URL,
  LAST_URL,
  LAST_WITH_ID_URL,
  LOGIN_URL,
  MEMBERS_URL,
  ME_URL,
  READ_URL,
  SINGLE_USER_URL,
  STATUS_URL,
  SUPERVISED_STUDENTS_URL,
  TASKS_URL,
  TEACHING_DEMANDS_URL,
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
export const login = credentials => {
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
export const getConnectedUser = token => {
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
export const getTotalUnreadMessages = token => {
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
export const getEvents = ({ token, page, limit }) => {
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
const getTasks = (token, url) => {
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
export const getOwnTasks = token => getTasks(token, TASKS_URL);

/**
 * Function used to retrieve the done tasks of the supervised students (teachers only)
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the tasks asked by the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getDoneStudentsTasks = token =>
  getTasks(token, DONE_STUDENTS_TASKS_URL);

/**
 * Function used to retrieve the todo tasks of the supervised students (teachers only)
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the tasks asked by the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getTodoStudentsTasks = token =>
  getTasks(token, TODO_STUDENTS_TASKS_URL);

/**
 * Function used to retrieve the validated tasks of the supervised students (teachers only)
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the tasks asked by the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getValidatedStudentsTasks = token =>
  getTasks(token, VALIDATED_STUDENTS_TASKS_URL);

/**
 * Function used to create a new task for the connected user
 * @param {string} token the jwt token of the logged user
 * @param {Object} task the data of the new task we want to create
 * @returns {Promise<Object>} a promise containing the new created task
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const createNewTask = (token, task) => {
  return makeApiCall(
    TASKS_URL,
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(task),
    },
    data => {
      const {
        data: { task },
      } = data;

      return { valid: true, authorized: true, task };
    },
    201
  );
};

/**
 * Function used to create a new task for a supervised student
 * @param {string} token the jwt token of the logged user
 * @param {string} userId the id of the student for which we want to create a new task
 * @param {Object} task the data of the new task we want to create
 * @returns {Promise<Object>} a promise containing the new created task
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const createStudentTask = (token, userId, task) => {
  return makeApiCall(
    SINGLE_STUDENT_TASKS_URL.replace('{userId}', userId),
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(task),
    },
    data => {
      const {
        data: { task },
      } = data;

      return { valid: true, authorized: true, task };
    },
    201
  );
};

/**
 * Function used to mark a task as completed
 * @param {string} token the jwt token of the logged user
 * @param {string} taskId the id of the task we want to mark as completed
 * @returns {Promise<Object>} a promise containing the updated task
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const completeTask = (token, taskId) => {
  return makeApiCall(
    COMPLETE_TASK_URL.replace('{id}', taskId),
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
        data: { task },
      } = data;

      return { valid: true, authorized: true, task };
    }
  );
};

/**
 * Function used to mark a task as validated
 * @param {string} token the jwt token of the logged user
 * @param {string} taskId the id of the task we want to mark as validated
 * @returns {Promise<Object>} a promise containing the updated task
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const validateTask = (token, taskId) => {
  return makeApiCall(
    VALIDATE_TASK_URL.replace('{id}', taskId),
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
        data: { task },
      } = data;

      return { valid: true, authorized: true, task };
    }
  );
};

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
export const getSupervisedStudents = ({ token }) => {
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
export const getLastMessages = token => {
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
export const getLastMessage = (token, userId) => {
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
export const getUnread = (token, id) => {
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
export const getConversation = (token, id, page = 1, limit = 10) => {
  return makeApiCall(
    `${CONVERSATION_WITH_ID_URL.replace(
      '{id}',
      id
    )}?page=${page}&limit=${limit}`,
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
 * Function used to read a specific message
 * @param {string} token the jwt token of the logged user
 * @param {string} messageId the id of the message we want to read
 * @returns {Promise<Object>} a promise containing the updated message we wanted to read
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const readMessage = (token, messageId) => {
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
export const sendMessage = (token, id, content) => {
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
export const sendMessageWithFiles = (token, id, formData) => {
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
export const getConnectionStatus = (token, userId) => {
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

/**
 * Function used to get the list of members participating in the platform
 * @param {string} token the jwt token of the logged user
 * @param {number} page the page number of the list of members we want to retrieve
 * @param {number} limit the number of user we want to retrieve per page
 * @returns {Promise<Object>} a promise containing the list of participating members
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getAllMembers = (token, page, limit = 12) => {
  return makeApiCall(
    MEMBERS_URL.replace('{page}', page).replace('{limit}', limit),
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
        data: { users },
      } = data;

      return { valid: true, authorized: true, users };
    }
  );
};

/**
 * The params of the getExistingMembers function
 * @typedef ExistingMembersParams
 * @property {string} token the jwt token of the logged user
 */

/**
 * Function used to get all existing users in the application
 * @param {Object<ExistingMembersParams>} existingMembersParams the parameter object of the function
 * @returns {Promise<Object>} a promise containing all existing members
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getExistingMembers = ({ token }) => {
  return makeApiCall(
    USERS_URL,
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
        data: { users },
      } = data;

      return { valid: true, authorized: true, users };
    }
  );
};

/**
 * Function used to retrieve a single user from the backend
 * @param {string} id the id of the user we want to retrieve
 * @returns {Promise<Object>} a promise containing the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getUser = id => {
  return makeApiCall(
    SINGLE_USER_URL.replace('{id}', id),
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { user },
      } = data;

      return { valid: true, authorized: true, user };
    }
  );
};
/**
 * Function used to retrieve the list of contacts of the connected user
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the list of the contacts of the logged user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getAllContacts = token => {
  return makeApiCall(
    CONTACTS_URL,
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
        data: { users },
      } = data;

      return { valid: true, authorized: true, users };
    }
  );
};

/**
 * Function used to get all the users that has sent a contact invitation to the connected user
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the list of users that has sent an invitation to the connected user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getAllInvitations = token => {
  return makeApiCall(
    INVITATIONS_URL,
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
        data: { users },
      } = data;

      return { valid: true, authorized: true, users };
    }
  );
};

/**
 * Function used to send a contact invitation to another user
 * @param {string} token the jwt token of the logged user
 * @param {string} userId the id of the user to which we want to send a contact invitation
 * @returns {Promise<Object>} a promise containing a message informing the logged user of the status of the invitation sending
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const sendInvitation = (token, userId) => {
  return makeApiCall(
    INVITE_URL.replace('{id}', userId),
    {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const { message } = data;

      return { valid: true, authorized: true, message };
    }
  );
};

/**
 * Function used to decline a contact invitation from another user
 * @param {string} token the jwt token of the logged user
 * @param {string} userId the id of the user to which we want to decline the invitation
 * @returns {Promise<Object>} a promise containing a message informing the result of the refusal process
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const declineInvitation = (token, userId) => {
  return makeApiCall(
    DECLINE_INVITATION_URL.replace('{id}', userId),
    {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const { message } = data;

      return { valid: true, authorized: true, message };
    }
  );
};

/**
 * Function use to accept a contact invitation and add the sender to the logged user's contacts
 * @param {string} token the jwt token of the logged user
 * @param {string} userId the id of the user the logged user wants to add in his contact list
 * @returns {Promise<Object>} a promise containing the array of updated contacts
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const addContact = (token, userId) => {
  return makeApiCall(
    CONTACTS_WITH_ID_URL.replace('{id}', userId),
    {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
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
 * Function used to remove an user from the contact list of the connected user
 * @param {string} token the jwt token of the logged user
 * @param {string} userId the id of the user the logged user wants to remove from his contact list
 * @returns {Promise<Object>} a promise containing the array of updated contacts
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const removeContact = (token, userId) => {
  return makeApiCall(
    CONTACTS_WITH_ID_URL.replace('{id}', userId),
    {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { users },
        message,
      } = data;

      return { valid: true, authorized: true, users, message };
    }
  );
};

/**
 * Function used to get the teaching demands sent to (teacher) / by (student) the logged user
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the array of teaching demands of the logged user
 */
export const getAllTeachingDemands = token => {
  return makeApiCall(
    TEACHING_DEMANDS_URL,
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
        data: { teachingDemands: demands },
      } = data;

      return { valid: true, authorized: true, demands };
    }
  );
};

/**
 * Function used, for a logged student, to send a teaching demand to a teacher
 * @param {string} token the jwt token of the logged user
 * @param {string} userId the id of the user to which we want to send a teaching demand
 * @returns {Promise<Object>} the new created teaching demand sent to the other user
 */
export const sendTeachingDemand = (token, userId) => {
  return makeApiCall(
    SEND_TEACHING_DEMAND_URL.replace('{userId}', userId),
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { teachingDemand: demand },
      } = data;

      return { valid: true, authorized: true, demand };
    },
    201
  );
};

/**
 * Function used, for a teacher, to accept a teaching demand from a student
 * @param {string} token the jwt token of the logged user
 * @param {string} id the teaching demand we want to accept
 * @returns {Promise<Object>} the accepted teaching demand
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const acceptTeachingDemand = (token, id) => {
  return makeApiCall(
    ACCEPT_DEMAND_URL.replace('{id}', id),
    {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { teachingDemand: demand },
      } = data;

      return { valid: true, authorized: true, demand };
    }
  );
};

/**
 * Function used, for a teacher, to cancel a teaching demand from a student
 * @param {string} token the jwt token of the logged user
 * @param {string} id the teaching demand we want to accept
 * @returns {Promise<Object>} the cancelled teaching demand
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const cancelTeachingDemand = (token, id) => {
  return makeApiCall(
    CANCEL_DEMAND_URL.replace('{id}', id),
    {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { teachingDemand: demand },
      } = data;

      return { valid: true, authorized: true, demand };
    }
  );
};

/**
 * Function used to get, for a connected student, all the teachers to which he hasn't send a teaching request
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the available teachers
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getAvailableTeachers = token => {
  return makeApiCall(
    AVAILABLE_TEACHERS_URL,
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
        data: { teachers },
      } = data;

      return { valid: true, authorized: true, teachers };
    }
  );
};

/**
 * Function used to get the supervision status of the logged user (for students only)
 * @param {string} token the jwt token of the logged user
 * @returns {Promise<Object>} a promise containing the supervision status of the logged student
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getSupervisedStatus = token => {
  return makeApiCall(
    SUPERVISED_STATUS_URL,
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
      const { supervised } = data;

      return { valid: true, authorized: true, supervised };
    }
  );
};

/**
 * Function used to get all the events of an user happening in the same period as a given date
 * @param {string} token the jwt token of the logged user
 * @param {string} date the date for which we want to get all the events
 * @param {string} period the type of period from which we want to get the events
 * @returns {Promise<Object>} a promise containing all the events happening at the same period as the given date
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getPeriodEvents = (token, date, period) => {
  let url;
  switch (period) {
    case 'month':
      url = MONTHLY_EVENTS_URL;
      break;
    case 'year':
      url = YEARLY_EVENTS_URL;
      break;
    default:
      url = WEEKLY_EVENTS_URL;
      break;
  }

  return makeApiCall(
    url.replace('{date}', date),
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
        data: { events },
      } = data;

      return { valid: true, authorized: true, events };
    }
  );
};

/**
 * Function used to create a new event for the connected user
 * @param {string} token the jwt token of the logged user
 * @param {Object} event the values of the fields of the event we want to create
 * @returns {Promise<Object>} a promise containing the new event that was created
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const createNewEvent = (token, event) => {
  return makeApiCall(
    EVENTS_URL,
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(event),
    },
    data => {
      const {
        data: { event },
      } = data;

      return { valid: true, authorized: true, event };
    },
    201
  );
};

/**
 * Function used to get a single event from the backend
 * @param {string} token the jwt token of the logged user
 * @param {string} eventId the id of the event we want to get the data
 * @returns {Promise<Object>} a promise containing the requested event
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const getSingleEvent = (token, eventId) => {
  return makeApiCall(
    SINGLE_EVENT_URL.replace('{id}', eventId),
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { event },
      } = data;

      return { valid: true, authorized: true, event };
    }
  );
};

/**
 * Function used to modify an existing event
 * @param {string} token the jwt token of the logged user
 * @param {Object} event the event we want to modify
 * @returns {Promise<Object>} a promise containing the updated event sent back by the backend
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const modifyExistingEvent = (token, event) => {
  const modificationEvent = { ...event };
  delete modificationEvent._id;
  delete modificationEvent.participants;
  delete modificationEvent.organizer;

  return makeApiCall(
    SINGLE_EVENT_URL.replace('{id}', event._id),
    {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(modificationEvent),
    },
    data => {
      const {
        data: { event },
      } = data;

      return { valid: true, authorized: true, event };
    }
  );
};

/**
 * Function used to delete an existing event
 * @param {string} token the jwt token of the logged user
 * @param {string} eventId the id of the event we want to delete
 * @returns {Promise<Object>} a promise containing the status of the deletion operation
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const deleteSingleEvent = (token, eventId) => {
  return makeApiCall(
    SINGLE_EVENT_URL.replace('{id}', eventId),
    {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    () => {
      return { valid: true, authorized: true };
    },
    204
  );
};

/**
 * Function used to accept an event invitation and to participate in it
 * @param {string} token the jwt token of the logged user
 * @param {string} eventId the id of the event we want to accept the invitation
 * @returns {Promise<Object>} a promise containing the update event after we accepted the invitation
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const acceptEventInvitation = (token, eventId) => {
  return makeApiCall(
    ACCEPT_EVENT_URL.replace('{id}', eventId),
    {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { event },
      } = data;

      return { valid: true, authorized: true, event };
    }
  );
};

/**
 * Function used to decline an event invitation and to participate in it
 * @param {string} token the jwt token of the logged user
 * @param {string} eventId the id of the event we want to decline the invitation
 * @returns {Promise<Object>} a promise containing the update event after we accepted the invitation
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
export const declineEventInvitation = (token, eventId) => {
  return makeApiCall(
    DECLINE_EVENT_URL.replace('{id}', eventId),
    {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
    data => {
      const {
        data: { event },
      } = data;

      return { valid: true, authorized: true, event };
    }
  );
};
