import { logout } from '../../../store/slice/auth';
import {
  acceptDemand,
  cancelDemand,
  closeNotification as closeDemandNotification,
} from '../../../store/slice/teaching-demands';
import {
  acceptInvitation,
  addUserToContactList,
  closeNotification as closeUserNotification,
  decline,
} from '../../../store/slice/users';
import { getSocket } from '../../../utils/utils';
import Button from '../Button/Button';
import styles from './Notification.module.scss';
import {
  faPersonChalkboard,
  faUserMinus,
  faUserPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

/**
 * Component representing a notification in the application (contact invitation, event, teaching demand, ...)
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Notification = props => {
  const {
    auth: { jwt },
    users: {
      me: { _id: connectedId, username: connectedUsername },
    },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const { userId, username, message, status, type } = props;
  const notificationRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState(false);
  const socket = getSocket();

  let icon = faUserPlus;
  let sender = true;

  switch (type) {
    case 'invite':
      icon = faUserPlus;
      break;
    case 'delete_contact':
      icon = faUserMinus;
      break;
    case 'receive_invitation':
      icon = faUserPlus;
      sender = false;
      break;
    case 'receive_teaching_demand':
      icon = faPersonChalkboard;
      sender = false;
      break;
    case 'teaching_demand_accepted':
      icon = faPersonChalkboard;
      sender = false;
      break;
    default:
      break;
  }

  useEffect(() => {
    if (!visible && !displayed) {
      setVisible(true);
      setDisplayed(true);
    }
  }, [visible, displayed]);

  let statusClassNames = styles['notification__status'];

  if (status) statusClassNames += ` ${styles['notification__status--success']}`;
  else statusClassNames += ` ${styles['notification__status--fail']}`;

  const closeHandler = () => {
    setVisible(false);
    setTimeout(() => {
      closeUserNotification(dispatch);
      closeDemandNotification(dispatch);
    }, 500);
  };

  const acceptContactHandler = async () => {
    const [valid, authorized] = await acceptInvitation(jwt, userId, dispatch);

    if (!authorized) logout(dispatch);

    if (valid && socket) {
      socket.emit('accept_invitation', {
        sender: { id: userId, username },
        receiver: { id: connectedId, username: connectedUsername },
      });
      await addUserToContactList(userId, dispatch);
      setVisible(false);
      setTimeout(() => {
        closeUserNotification(dispatch);
      }, 500);
    }
  };
  const refuseContactHandler = async () => {
    const authorized = await decline(jwt, userId, dispatch);

    if (!authorized) {
      logout(dispatch);
    }

    setVisible(false);
    setTimeout(() => {
      closeUserNotification(dispatch);
    }, 500);
  };

  const acceptDemandHandler = async () => {
    const [authorized, demand] = await acceptDemand(jwt, userId, dispatch);
    if (!authorized) {
      logout(dispatch);
      return;
    }
    socket.emit('accept_teaching_demand', demand);
    setTimeout(() => {
      closeDemandNotification(dispatch);
    }, 500);
  };

  const cancelDemandHandler = async () => {
    const [authorized, demand] = await cancelDemand(jwt, userId, dispatch);
    if (!authorized) {
      logout(dispatch);
      return;
    }
    socket.emit('cancel_teaching_demand', demand);
    setTimeout(() => {
      closeDemandNotification(dispatch);
    }, 500);
  };

  const notificationClickHandler = event => {
    event.stopPropagation();
  };

  const acceptHandler =
    type === 'receive_invitation' ? acceptContactHandler : acceptDemandHandler;

  const refuseHandler =
    type === 'receive_invitation' ? refuseContactHandler : cancelDemandHandler;

  return (
    <CSSTransition
      nodeRef={notificationRef}
      timeout={500}
      in={visible}
      classNames={{
        enter: styles['notification__background-enter'],
        enterActive: styles['notification__background-enter-active'],
        enterDone: styles['notification__background-enter-done'],
        exit: styles['notification__background-exit'],
        exitActive: styles['notification__background-exit-active'],
        exitDone: styles['notification__background-exit-done'],
      }}
      mountOnEnter
      unmountOnExit
    >
      <div
        className={styles['notification__background']}
        ref={notificationRef}
        onClick={closeHandler}
      >
        <div className={styles.notification} onClick={notificationClickHandler}>
          <div className={styles['notification__header']}>
            <div className={styles['notification__picture-container']}>
              <FontAwesomeIcon
                className={styles['notification__picture']}
                icon={icon}
              />
            </div>
            <h2 className={styles['notification__title']}>Invitation</h2>
            <span className={styles['notification__receiver-text']}>
              Sent {sender ? 'to' : 'by'}{' '}
              <span className={styles['notification__receiver']}>
                {username}
              </span>
            </span>
          </div>
          {type !== 'receive_invitation' && (
            <h3 className={statusClassNames}>{status ? 'Success' : 'Fail'}</h3>
          )}
          {type === 'receive_invitation' && (
            <h3 className={styles['notification__status']}>Invitation</h3>
          )}
          <p className={styles['notification__message']}>{message}</p>
          <FontAwesomeIcon
            className={styles['notification__close-btn']}
            icon={faXmark}
            onClick={closeHandler}
          />
          {(type === 'receive_invitation' ||
            type === 'receive_teaching_demand') && (
            <div className={styles['notification__actions']}>
              <Button
                className={`${styles['notification__action']} ${styles['notification__action--left']}`}
                text="Refuse"
                type="button"
                onClick={refuseHandler}
              />
              <Button
                className={`${styles['notification__action']} ${styles['notification__action--right']}`}
                text="Accept"
                type="button"
                onClick={acceptHandler}
              />
            </div>
          )}
        </div>
      </div>
    </CSSTransition>
  );
};

Notification.propTypes = {
  /** the id of the user that sent (or to whom we sent) the notification */
  userId: PropTypes.string,
  /** the username of the user that sent (or to whom we sent) the notification */
  username: PropTypes.string,
  /** the message displayed inside the notification */
  message: PropTypes.string,
  /** the status type of the notification (success or fail) */
  status: PropTypes.bool,
  /** the type of the notification (invite, delete_contact, ...) */
  type: PropTypes.string,
};

export default Notification;
