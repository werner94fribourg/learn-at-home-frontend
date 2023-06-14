import {
  setToken,
  setErrorMessage,
  setSuccessMessage,
} from '../../../store/slice/auth';
import { checkPassword, resetPassword } from '../../../utils/api';
import { setActivePeriod } from '../../../utils/utils';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import styles from './Form.module.scss';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

/**
 * Form component in the ResetPassword page, representing the form used to reset the forgotten password of the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Form = props => {
  const { resetToken } = props;
  const passwordRef = useRef(null);
  const [passwordMessage, setPasswordMessage] = useState('');
  const passwordConfirmRef = useRef(null);
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changePasswordHandler = async (type, event) => {
    const {
      current: { value: password },
    } = passwordRef;
    if (type === 'passwordConfirm') {
      if (event.target.value !== password) {
        setPasswordConfirmMessage('Passwords are not the same.');
        return;
      }
      setPasswordConfirmMessage('');
      return;
    }

    const { valid, validations } = await checkPassword(event.target.value);

    if (valid && validations?.length > 0) {
      const [{ message }] = validations;
      setPasswordMessage(message);
      return;
    }
    setPasswordMessage('');
  };

  const submitHandler = async event => {
    event.preventDefault();
    const {
      current: { value: password },
    } = passwordRef;
    const {
      current: { value: passwordConfirm },
    } = passwordConfirmRef;

    const { valid, token, message } = await resetPassword(resetToken, {
      password,
      passwordConfirm,
    });

    if (!valid) {
      setErrorMessage(message, dispatch);
      return;
    }

    setToken(token, dispatch);
    setSuccessMessage('Password successfully changed.', dispatch);
    navigate('/');
  };

  return (
    <form className={styles.form} onSubmit={submitHandler}>
      <div className={styles['form__input-container']}>
        <Input
          className={setActivePeriod(
            passwordMessage !== '',
            styles['form__input'],
            styles['form__input--invalid']
          )}
          title="Password"
          id="password"
          type="password"
          placeholder="Password"
          inputRef={passwordRef}
          onChange={changePasswordHandler.bind(null, 'password')}
        />
        {passwordMessage !== '' && (
          <p className={styles['err-message']}>{passwordMessage}</p>
        )}
      </div>
      <div className={styles['form__input-container']}>
        <Input
          className={setActivePeriod(
            passwordConfirmMessage !== '',
            styles['form__input'],
            styles['form__input--invalid']
          )}
          title="Confirm Password"
          id="passwordConfirm"
          type="password"
          placeholder="Confirm Password"
          inputRef={passwordConfirmRef}
          onChange={changePasswordHandler.bind(null, 'passwordConfirm')}
        />
        {passwordConfirmMessage !== '' && (
          <p className={styles['err-message']}>{passwordConfirmMessage}</p>
        )}
      </div>
      <Button
        className={styles['form__btn']}
        type="submit"
        text="Change password"
      />
    </form>
  );
};

Form.propTypes = {
  /** the reset token used to change the password of the user */
  resetToken: PropTypes.string,
};

export default Form;
