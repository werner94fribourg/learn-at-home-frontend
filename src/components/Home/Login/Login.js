import { connect, resetErrorMessage } from '../../../store/slice/auth';
import Alert from '../../UI/Alert/Alert';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import styles from './Login.module.scss';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

/**
 * Login component in the Home page, representing the right content (including the connection form) when accessing this page
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Login = () => {
  const errorMessage = useSelector(state => state.auth.authErrorMessage);
  const dispatch = useDispatch();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [passwordShown, setPasswordShown] = useState(false);

  const iconHandler = () => {
    setPasswordShown(prevState => !prevState);
  };

  const formHandler = event => {
    event.preventDefault();
    const {
      current: { value: username },
    } = usernameRef;
    const {
      current: { value: password },
    } = passwordRef;

    connect({ username, password }, dispatch);
  };

  const alertHandler = () => {
    resetErrorMessage(dispatch);
  };

  return (
    <section className={styles.login}>
      <div className={styles['login__title-container']}>
        <h2 className={styles['login__title']}>Welcome back 🔥</h2>
        <p className={styles['login__description']}>
          Enter your credentials to login
        </p>
        <p className={styles['login__nb']}>
          To test the app (options): <br />- create a new account <br />- use
          the placeholders in the form as credentials to connect (teacher or
          student).
        </p>
      </div>
      <form className={styles['login__form']} onSubmit={formHandler}>
        <Input
          className={styles['login__input']}
          title="Username"
          id="username"
          type="text"
          placeholder="teacher / student"
          inputRef={usernameRef}
        />
        <Input
          className={styles['login__input']}
          title="Password"
          id="password"
          type={passwordShown ? 'text' : 'password'}
          placeholder="Test@1234"
          inputRef={passwordRef}
        >
          <FontAwesomeIcon
            icon={passwordShown ? faEye : faEyeSlash}
            onClick={iconHandler}
          />
        </Input>
        <Link className={styles['login__forgot-link']} to="/forgot-password">
          Forgotten password
        </Link>
        <Button
          className={styles['login__submit-btn']}
          type="submit"
          text="Login"
        />
      </form>
      <p className={styles['login__signup']}>
        Not registered yet ? <Link to="/signup">Signup</Link>
      </p>
      {errorMessage &&
        createPortal(
          <Alert message={errorMessage} type="error" onClose={alertHandler} />,
          document.querySelector('#root')
        )}
    </section>
  );
};

Login.propTypes = {};

export default Login;
