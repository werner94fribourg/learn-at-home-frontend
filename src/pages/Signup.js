import Form from '../components/Signup/Form/Form';
import styles from './Signup.module.scss';

/**
 * Component representing the Signup page of the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Signup = () => {
  return (
    <div className={styles.signup}>
      <div className={styles['signup__content']}>
        <h1 className={styles['signup__title']}>Signup</h1>
        <Form />
      </div>
    </div>
  );
};

Signup.propTypes = {};

export default Signup;
