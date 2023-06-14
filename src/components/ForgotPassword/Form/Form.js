import {
  resetErrorMessage,
  setConfirmationStatus,
} from '../../../store/slice/auth';
import { setErrorMessage } from '../../../store/slice/auth';
import { forgotPassword } from '../../../utils/api';
import Alert from '../../UI/Alert/Alert';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import styles from './Form.module.scss';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

/**
 * Form component in the ForgotPassword page, representing the form used to send a forgot password request
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Form = () => {
  const errorMessage = useSelector(state => state.auth.authErrorMessage);
  const mailRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async event => {
    event.preventDefault();
    const {
      current: { value },
    } = mailRef;

    const { valid, message } = await forgotPassword({ email: value });

    if (!valid) {
      setErrorMessage(message, dispatch);
      return;
    }

    setConfirmationStatus(true, message, dispatch, 'password_forgotten');

    navigate('/confirmation');
  };

  const alertHandler = () => {
    resetErrorMessage(dispatch);
  };

  return (
    <form className={styles.form} onSubmit={submitHandler}>
      <Input
        className={styles['form__input']}
        title="E-mail address"
        id="email"
        type="email"
        placeholder="E-mail address"
        inputRef={mailRef}
      />
      <Button className={styles['form__btn']} type="submit" text="Send" />
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
