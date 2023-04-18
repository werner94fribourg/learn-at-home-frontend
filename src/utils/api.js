/**
 * Store of all global helper functions used in the application
 * @module helpers
 */
import { LOGIN_URL } from './globals';

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
      success: false,
      message: 'An unknow error happened. Try again later.',
    };
  }
};
