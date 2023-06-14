import { setConfirmationStatus } from '../../../store/slice/auth';
import styles from './ConfirmationPage.module.scss';
import { faAddressCard, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

/**
 * ConfirmationPage component in the Confirmation page, representing the confirmation page content when the user successfully confirms its registration into the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const ConfirmationPage = () => {
  const { confirmationMessage, confirmationType } = useSelector(
    state => state.auth
  );
  const dispatch = useDispatch();
  const paragraphs = confirmationMessage.split('\n');
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/login');
      setTimeout(() => {
        setConfirmationStatus(false, '', dispatch, '');
      }, 500);
    }, 2500);
  }, [navigate, dispatch]);

  let icon;

  if (confirmationType === 'registration') icon = faAddressCard;

  if (confirmationType === 'password_forgotten') icon = faKey;

  return (
    <div className={styles.confirmation}>
      <FontAwesomeIcon className={styles['confirmation__icon']} icon={icon} />
      <h1 className={styles['confirmation__title']}>
        {paragraphs.map((p, index) => (
          <Fragment key={index}>
            {p}
            <br />
          </Fragment>
        ))}
      </h1>
    </div>
  );
};

export default ConfirmationPage;
