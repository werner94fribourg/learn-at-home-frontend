import {
  confirmInscription,
  setSuccessMessage,
} from '../../../store/slice/auth';
import { confirm } from '../../../utils/api';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

/**
 * Confirmation component in the application, representing the registration confirmation link and redirection to the dashboard if the confirmation succeeds
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Confirmation = () => {
  const { confirmToken } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const sendConfirmation = async () => {
      const { valid, token } = await confirm(confirmToken);

      if (valid) {
        confirmInscription(token, dispatch);
        setSuccessMessage('Account successfully confirmed.', dispatch);
      }

      navigate('/');
    };

    sendConfirmation();
  }, [confirmToken, navigate, dispatch]);
  return <div></div>;
};

Confirmation.propTypes = {};

export default Confirmation;
