import Form from '../components/ForgotPassword/Form/Form';
import styles from './Forms.module.scss';

/**
 * Component representing the forgot password page of the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const ForgotPassword = () => {
  return (
    <div className={styles.signup}>
      <div className={styles['signup__content']}>
        <h1 className={styles['signup__title']}>Password forgotten</h1>
        <Form />
      </div>
    </div>
  );
};

ForgotPassword.propTypes = {};

export default ForgotPassword;
