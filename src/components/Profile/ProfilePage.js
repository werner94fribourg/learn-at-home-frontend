import {
  logout,
  modifyUserPassword,
  resetErrorMessage,
  setErrorMessage,
  setSuccessMessage,
} from '../../store/slice/auth';
import { setMe, setMeWithProfilePicture } from '../../store/slice/users';
import { checkPassword } from '../../utils/api';
import { invalidFieldsReducer, setActivePeriod } from '../../utils/utils';
import { userReducers } from '../../utils/utils';
import Alert from '../UI/Alert/Alert';
import Form from './Form/Form';
import Input from './Input/Input';
import styles from './ProfilePage.module.scss';
import SideNav from './SideNav/SideNav';
import { useEffect, useReducer, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

/**
 * ProfilePage component in the the profile page, representing the profile page content
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const ProfilePage = () => {
  const {
    auth: { jwt, authErrorMessage },
    users: {
      me,
      me: { photo },
    },
  } = useSelector(state => state);
  const [typedUser, dispatchUser] = useReducer(userReducers, me);
  const [messages, dispatchMessages] = useReducer(
    invalidFieldsReducer,
    undefined
  );
  const photoRef = useRef(null);
  const passwordCurrentRef = useRef(null);
  const [updatePassword, setUpdatePassword] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatchUser({ type: 'init' });
    dispatchMessages({ type: 'init' });
  }, []);

  const alertHandler = () => {
    resetErrorMessage(dispatch);
  };

  const changeHandler = (type, event) => {
    if (messages[type]) dispatchMessages({ type: `reset_${type}` });
    dispatchUser({ type, payload: event.target.value });
  };

  const changePasswordHandler = async (type, event) => {
    changeHandler(type, event);
    if (type === 'passwordConfirm') {
      if (event.target.value !== typedUser.password)
        dispatchMessages({ type, payload: 'Passwords are not the same.' });

      return;
    }
    const { valid, validations } = await checkPassword(event.target.value);

    if (valid && validations?.length > 0) {
      const [{ message }] = validations;
      dispatchMessages({ type, payload: message });
    }
  };

  const clickNavLinkHandler = value => {
    setUpdatePassword(value);
  };

  const accountHandler = async event => {
    event.preventDefault();
    const { username, email, firstname, lastname } = typedUser;
    const {
      current: { files },
    } = photoRef;

    let valid, authorized, message, fields;

    let newPhoto = photo;
    if (files.length > 0) {
      const form = new FormData();
      const [file] = files;
      form.append('photo', file, file.name);
      form.append('username', username);
      form.append('email', email);
      form.append('firstname', firstname);
      form.append('lastname', lastname);

      [valid, authorized, message, fields, newPhoto] =
        await setMeWithProfilePicture(jwt, form, dispatch);
    } else {
      const submitData = { username, email, firstname, lastname };

      [valid, authorized, message, fields] = await setMe(
        jwt,
        submitData,
        dispatch
      );
    }

    if (!valid) {
      fields?.forEach(field => {
        const [[key, value]] = Object.entries(field);
        dispatchMessages({ type: key, payload: value });
      });

      setErrorMessage(message, dispatch);
      return;
    }

    if (!authorized) {
      logout(dispatch);
      return;
    }

    photoRef.current.value = '';

    dispatchUser({ type: 'photo', payload: newPhoto });
    setSuccessMessage('Account successfully modified', dispatch);
    return;
  };

  const passwordHandler = async event => {
    event.preventDefault();

    const {
      current: { value: passwordCurrent },
    } = passwordCurrentRef;

    const { password, passwordConfirm } = typedUser;
    const [valid, authorized, message, fields] = await modifyUserPassword(
      jwt,
      {
        passwordCurrent,
        password,
        passwordConfirm,
      },
      dispatch
    );

    if (!valid) {
      fields?.forEach(field => {
        const [[key, value]] = Object.entries(field);
        dispatchMessages({ type: key, payload: value });
      });

      setErrorMessage(message, dispatch);
      return;
    }

    if (!authorized) {
      logout(dispatch);
      return;
    }

    passwordCurrentRef.current.value = '';
    dispatchUser({ type: 'reset_password' });
    dispatchUser({ type: 'reset_passwordConfirm' });
    setSuccessMessage('Password successfully modified', dispatch);
  };

  return (
    <div className={styles.profile}>
      <SideNav status={updatePassword} onNavClick={clickNavLinkHandler} />
      <div className={styles['profile__content']}>
        <div className={styles['profile__form-container']}>
          {!updatePassword && (
            <Form name="Your account settings" onSubmit={accountHandler}>
              <div
                className={setActivePeriod(
                  messages?.username,
                  styles['profile__input-container'],
                  styles['profile__input-container--invalid']
                )}
              >
                <Input
                  title="Username"
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={typedUser?.username}
                  required={true}
                  onChange={changeHandler.bind(null, 'username')}
                />
                {messages?.username && (
                  <p className={styles['err-message']}>{messages?.username}</p>
                )}
              </div>
              <div
                className={setActivePeriod(
                  messages?.email,
                  styles['profile__input-container'],
                  styles['profile__input-container--invalid']
                )}
              >
                <Input
                  title="Email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={typedUser?.email}
                  required={true}
                  onChange={changeHandler.bind(null, 'email')}
                />
                {messages?.email && (
                  <p className={styles['err-message']}>{messages?.email}</p>
                )}
              </div>
              <div
                className={setActivePeriod(
                  messages?.firstname,
                  styles['profile__input-container'],
                  styles['profile__input-container--invalid']
                )}
              >
                <Input
                  title="First Name"
                  id="firstname"
                  type="text"
                  placeholder="First Name"
                  value={typedUser?.firstname}
                  required={true}
                  onChange={changeHandler.bind(null, 'firstname')}
                />
                {messages?.firstname && (
                  <p className={styles['err-message']}>{messages?.firstname}</p>
                )}
              </div>
              <div
                className={setActivePeriod(
                  messages?.lastname,
                  styles['profile__input-container'],
                  styles['profile__input-container--invalid']
                )}
              >
                <Input
                  title="Last Name"
                  id="lastname"
                  type="text"
                  placeholder="Last Name"
                  value={typedUser?.lastname}
                  required={true}
                  onChange={changeHandler.bind(null, 'lastname')}
                />
                {messages?.lastname && (
                  <p className={styles['err-message']}>{messages?.lastname}</p>
                )}
              </div>
              <Input
                title={
                  typedUser?.photo === photo
                    ? 'Choose new photo'
                    : typedUser?.photo.split('\\').pop()
                }
                id="photo"
                type="file"
                accept="image/*"
                photo={true}
                inputRef={photoRef}
                onChange={changeHandler.bind(null, 'photo')}
              >
                <img
                  className={styles['profile__userphoto']}
                  src={photo}
                  alt="User"
                />
              </Input>
            </Form>
          )}
          {updatePassword && (
            <Form name="Password change" onSubmit={passwordHandler}>
              <Input
                title="Current password"
                id="passwordCurrent"
                type="password"
                placeholder="Current password"
                inputRef={passwordCurrentRef}
                required={true}
              />
              <div
                className={setActivePeriod(
                  messages?.password,
                  styles['profile__input-container'],
                  styles['profile__input-container--invalid']
                )}
              >
                <Input
                  title="New password"
                  id="password"
                  type="password"
                  placeholder="New password"
                  required={true}
                  value={typedUser?.password || ''}
                  onChange={changePasswordHandler.bind(null, 'password')}
                />
                {messages?.password && (
                  <p className={styles['err-message']}>{messages?.password}</p>
                )}
              </div>
              <div
                className={setActivePeriod(
                  messages?.passwordConfirm,
                  styles['profile__input-container'],
                  styles['profile__input-container--invalid']
                )}
              >
                <Input
                  title="Confirm password"
                  id="passwordConfirm"
                  type="password"
                  placeholder="Confirm password"
                  required={true}
                  value={typedUser?.passwordConfirm || ''}
                  onChange={changePasswordHandler.bind(null, 'passwordConfirm')}
                />
                {messages?.passwordConfirm && (
                  <p className={styles['err-message']}>
                    {messages?.passwordConfirm}
                  </p>
                )}
              </div>
            </Form>
          )}
        </div>
      </div>
      {authErrorMessage &&
        createPortal(
          <Alert
            message={authErrorMessage}
            type="error"
            onClose={alertHandler}
          />,
          document.querySelector('#root')
        )}
    </div>
  );
};

ProfilePage.propTypes = {};

export default ProfilePage;
