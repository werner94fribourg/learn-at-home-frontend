import {
  resetErrorMessage,
  setErrorMessage,
  setSignupStatus,
} from '../../../store/slice/auth';
import { checkPassword, signup } from '../../../utils/api';
import {
  invalidFieldsReducer,
  setActivePeriod,
  userReducers,
} from '../../../utils/utils';
import Alert from '../../UI/Alert/Alert';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import styles from './Form.module.scss';
import { Fragment, useEffect, useReducer } from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

/**
 * Form component in the Signup page, representing the form used to register into the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Form = () => {
  const errorMessage = useSelector(state => state.auth.authErrorMessage);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [typedUser, dispatchUser] = useReducer(userReducers, undefined);
  const [messages, dispatchMessages] = useReducer(
    invalidFieldsReducer,
    undefined
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatchUser({ type: 'init' });
    dispatchMessages({ type: 'init' });
  }, []);

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

  const previousHandler = () => {
    setPage(prevState => (prevState === 1 ? prevState : prevState - 1));
    dispatchUser({ type: 'reset_password' });
    dispatchUser({ type: 'reset_passwordConfirm' });
  };

  const nextHandler = async event => {
    event.preventDefault();
    dispatchMessages({ type: 'reset_all' });
    const { valid, message, fields } = await signup(typedUser);

    const invalidFields = fields?.filter(
      field => !field.role && !field.password && !field.passwordConfirm
    );

    if (!invalidFields) {
      if (!valid) setErrorMessage(message, dispatch);

      return;
    } else if (invalidFields.length > 0) {
      invalidFields.forEach(field => {
        const [[key, value]] = Object.entries(field);
        dispatchMessages({ type: key, payload: value });
      });

      return;
    }

    setPage(prevState => (prevState === 2 ? prevState : prevState + 1));
  };

  const submitHandler = async event => {
    event.preventDefault();
    dispatchMessages({ type: 'reset_all' });
    const { valid, message, fields } = await signup(typedUser);

    const invalidFields = fields?.filter(
      field => field.role || field.password || field.passwordConfirm
    );

    if (!invalidFields && !valid) {
      setErrorMessage(message, dispatch);
      return;
    } else if (invalidFields && invalidFields.length > 0) {
      invalidFields.forEach(field => {
        const [[key, value]] = Object.entries(field);
        dispatchMessages({ type: key, payload: value });
      });

      return;
    }

    setSignupStatus(true, message, dispatch);

    navigate('/confirmation');
  };

  const alertHandler = () => {
    resetErrorMessage(dispatch);
  };

  return (
    <form
      className={styles.form}
      onSubmit={page === 1 ? nextHandler : submitHandler}
    >
      {page === 1 && (
        <Fragment>
          <div className={styles['form__input-container']}>
            <Input
              className={setActivePeriod(
                messages?.username !== '',
                styles['form__input'],
                styles['form__input--invalid']
              )}
              title="Username"
              id="username"
              type="text"
              placeholder="Username"
              value={typedUser?.username || ''}
              onChange={changeHandler.bind(null, 'username')}
            />
            {messages?.username && (
              <p className={styles['err-message']}>{messages?.username}</p>
            )}
          </div>
          <div className={styles['form__input-container']}>
            <Input
              className={setActivePeriod(
                messages?.email !== '',
                styles['form__input'],
                styles['form__input--invalid']
              )}
              title="E-mail address"
              id="email"
              type="email"
              placeholder="E-mail address"
              value={typedUser?.email || ''}
              onChange={changeHandler.bind(null, 'email')}
            />
            {messages?.email && (
              <p className={styles['err-message']}>{messages?.email}</p>
            )}
          </div>
          <div className={styles['form__input-container']}>
            <Input
              className={setActivePeriod(
                messages?.firstname !== '',
                styles['form__input'],
                styles['form__input--invalid']
              )}
              title="Firstname"
              id="firstname"
              type="text"
              placeholder="Firstname"
              value={typedUser?.firstname || ''}
              onChange={changeHandler.bind(null, 'firstname')}
            />
            {messages?.firstname && (
              <p className={styles['err-message']}>{messages?.firstname}</p>
            )}
          </div>
          <div className={styles['form__input-container']}>
            <Input
              className={setActivePeriod(
                messages?.lastname !== '',
                styles['form__input'],
                styles['form__input--invalid']
              )}
              title="Lastname"
              id="lastname"
              type="text"
              placeholder="Lastname"
              value={typedUser?.lastname || ''}
              onChange={changeHandler.bind(null, 'lastname')}
            />
            {messages?.lastname && (
              <p className={styles['err-message']}>{messages?.lastname}</p>
            )}
          </div>
        </Fragment>
      )}
      {page === 2 && (
        <Fragment>
          <div className={styles['form__input-container']}>
            <Input
              className={styles['form__input']}
              title="Role"
              id="role"
              type="radio"
              placeholder="Role"
              options={[
                { value: 'student', name: 'Student' },
                { value: 'teacher', name: 'Teacher' },
              ]}
              value={typedUser?.role || ''}
              onChange={changeHandler.bind(null, 'role')}
            />
            {messages.role && (
              <p className={styles['err-message']}>{messages.role}</p>
            )}
          </div>
          <div className={styles['form__input-container']}>
            <Input
              className={setActivePeriod(
                messages.password !== '',
                styles['form__input'],
                styles['form__input--invalid']
              )}
              title="Password"
              id="password"
              type="password"
              placeholder="Password"
              value={typedUser?.password || ''}
              onChange={changePasswordHandler.bind(null, 'password')}
            />
            {messages.password && (
              <p className={styles['err-message']}>{messages.password}</p>
            )}
          </div>
          <div className={styles['form__input-container']}>
            <Input
              className={setActivePeriod(
                messages.passwordConfirm !== '',
                styles['form__input'],
                styles['form__input--invalid']
              )}
              title="Confirm Password"
              id="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              value={typedUser?.passwordConfirm || ''}
              onChange={changePasswordHandler.bind(null, 'passwordConfirm')}
            />
            {messages.passwordConfirm && (
              <p className={styles['err-message']}>
                {messages.passwordConfirm}
              </p>
            )}
          </div>
        </Fragment>
      )}
      <div className={styles['form__navigations']}>
        <Button
          className={`${styles['form__btn']} ${styles['form__btn--previous']}`}
          type="button"
          text="Previous"
          onClick={previousHandler}
          disabled={page === 1}
        />
        {page === 1 && (
          <Button className={styles['form__btn']} type="submit" text="Next" />
        )}
        {page === 2 && (
          <Button className={styles['form__btn']} type="submit" text="Submit" />
        )}
      </div>
      {errorMessage &&
        createPortal(
          <Alert message={errorMessage} type="error" onClose={alertHandler} />,
          document.querySelector('#root')
        )}
    </form>
  );
};

Form.propTypes = {};

export default Form;
