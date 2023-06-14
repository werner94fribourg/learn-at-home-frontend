import Form from '../components/ResetPassword/Form/Form';
import { getResetLinkValidity } from '../utils/api';
import styles from './Forms.module.scss';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

/**
 * Component representing the reset password page of the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getValidityLink = async () => {
      const { valid, validity } = await getResetLinkValidity(resetToken);

      if (!valid || !validity) {
        navigate('/');
      }
    };

    getValidityLink();
  }, [resetToken, navigate]);

  return (
    <div className={styles.signup}>
      <div className={styles['signup__content']}>
        <h1 className={styles['signup__title']}>Reset password</h1>
        <Form resetToken={resetToken} />
      </div>
    </div>
  );
};

ResetPassword.propTypes = {};

export default ResetPassword;
