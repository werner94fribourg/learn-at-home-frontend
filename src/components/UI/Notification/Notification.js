import { logout } from '../../../store/slice/auth';
import {
  closeNotification as closeEventNotification,
  declineParticipation,
  participateInEvent,
} from '../../../store/slice/calendar';
import { closeNotification as closeTasksNotification } from '../../../store/slice/tasks';
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
  faCalendar,
  faListCheck,
  faPen,
  faPersonChalkboard,
  faUserMinus,
  faUserPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
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
  const {
    id,
    username,
    message,
    status,
    type,
    title,
    beginning,
    end,
    accepted,
    validated,
  } = props;
  const notificationRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState(false);
  const socket = getSocket();

  let icon = faUserPlus;
  let sender = true;
  let notificationTitle = 'Invitation';
  let receiverTextIntroduction = `Sent ${sender ? 'to' : 'by'} `;
  switch (type) {
    case 'invite':
      icon = faUserPlus;
      break;
    case 'delete_contact':
      icon = faUserMinus;
      notificationTitle = 'Contact removal';
      break;
    case 'receive_invitation':
      icon = faUserPlus;
      sender = false;
      break;
    case 'receive_teaching_demand':
      icon = faPersonChalkboard;
      notificationTitle = 'Teaching demand';
      sender = false;
      break;
    case 'teaching_demand_accepted':
      icon = faPersonChalkboard;
      notificationTitle = 'Teaching demand';
      sender = false;
      break;
    case 'event_created':
      icon = faCalendar;
      notificationTitle = 'Event';
      receiverTextIntroduction = 'Organized by ';
      break;
    case 'event_notified':
      icon = faCalendar;
      notificationTitle = 'Event';
      receiverTextIntroduction = 'Organized by ';
      break;
    case 'receive_event':
      icon = faCalendar;
      notificationTitle = 'Event';
      receiverTextIntroduction = 'Organized by ';
      break;
    case 'event_accepted':
      icon = faCalendar;
      notificationTitle = 'Invitation accepted';
      receiverTextIntroduction = 'Accepted by ';
      break;
    case 'event_declined':
      icon = faCalendar;
      notificationTitle = 'Invitation declined';
      receiverTextIntroduction = 'Declined by ';
      break;
    case 'event_modified':
      icon = faPen;
      notificationTitle = 'Modification';
      receiverTextIntroduction = 'Type of change : ';
      break;
    case 'event_deleted':
      icon = faPen;
      notificationTitle = 'Cancellation';
      receiverTextIntroduction = 'Type of change : ';
      break;
    case 'task_created':
      icon = faListCheck;
      notificationTitle = 'Task';
      receiverTextIntroduction = 'Created by ';
      break;
    case 'task_modified':
      icon = faListCheck;
      notificationTitle = 'Task';
      receiverTextIntroduction = `${validated ? 'Validated' : 'Completed'} by `;
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
      closeEventNotification(dispatch);
      closeTasksNotification(dispatch);
    }, 500);
  };

  const acceptContactHandler = async () => {
    const [valid, authorized] = await acceptInvitation(jwt, id, dispatch);

    if (!authorized) logout(dispatch);

    if (valid && socket) {
      socket.emit('accept_invitation', {
        sender: { id: id, username },
        receiver: { id: connectedId, username: connectedUsername },
      });
      await addUserToContactList(id, dispatch);
      setVisible(false);
      setTimeout(() => {
        closeUserNotification(dispatch);
      }, 500);
    }
  };
  const refuseContactHandler = async () => {
    const [valid, authorized] = await decline(jwt, id, dispatch);

    if (!authorized) {
      logout(dispatch);
    }
    if (valid) {
      setVisible(false);
      setTimeout(() => {
        closeUserNotification(dispatch);
      }, 500);
    }
  };

  const acceptDemandHandler = async () => {
    const [valid, authorized, demand] = await acceptDemand(jwt, id, dispatch);
    if (!authorized) {
      logout(dispatch);
      return;
    }
    if (valid && socket) {
      socket.emit('accept_teaching_demand', demand);
      setVisible(false);
      setTimeout(() => {
        closeDemandNotification(dispatch);
      }, 500);
    }
  };

  const cancelDemandHandler = async () => {
    const [valid, authorized, demand] = await cancelDemand(jwt, id, dispatch);
    if (!authorized) {
      logout(dispatch);
      return;
    }
    if (valid && socket) {
      socket.emit('cancel_teaching_demand', demand);
      setVisible(false);
      setTimeout(() => {
        closeDemandNotification(dispatch);
      }, 500);
    }
  };

  const notificationClickHandler = event => {
    event.stopPropagation();
  };

  const acceptEventInvitation = async () => {
    const [valid, authorized, event] = await participateInEvent(
      jwt,
      id,
      dispatch
    );

    if (!authorized) {
      logout(dispatch);
      return;
    }

    if (valid && socket) {
      socket.emit('accept_event', { sender: connectedUsername, event });
      setVisible(false);
      setTimeout(() => {
        closeEventNotification(dispatch);
      }, 500);
    }
  };

  const declineEventInvitation = async () => {
    const [valid, authorized, event] = await declineParticipation(
      jwt,
      id,
      dispatch
    );

    if (!authorized) {
      logout(dispatch);
      return;
    }

    if (valid && socket) {
      socket.emit('decline_event', { sender: connectedUsername, event });
      setVisible(false);
      setTimeout(() => {
        closeEventNotification(dispatch);
      }, 500);
    }
  };

  const acceptHandler =
    type === 'receive_invitation'
      ? acceptContactHandler
      : type === 'receive_event'
      ? acceptEventInvitation
      : acceptDemandHandler;

  const refuseHandler =
    type === 'receive_invitation'
      ? refuseContactHandler
      : type === 'receive_event'
      ? declineEventInvitation
      : cancelDemandHandler;

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
            <h2 className={styles['notification__title']}>
              {notificationTitle}
            </h2>
            <span className={styles['notification__receiver-text']}>
              {receiverTextIntroduction}
              <span className={styles['notification__receiver']}>
                {username}
              </span>
            </span>
          </div>
          {type !== 'receive_invitation' &&
            type !== 'receive_teaching_demand' &&
            type !== 'receive_event' &&
            type !== 'event_notified' &&
            type !== 'event_accepted' &&
            type !== 'event_declined' &&
            type !== 'event_modified' &&
            type !== 'task_modified' &&
            type === 'event_deleted' && (
              <h3 className={statusClassNames}>
                {status ? 'Success' : 'Fail'}
              </h3>
            )}
          {(type === 'receive_invitation' ||
            type === 'receive_teaching_demand' ||
            type === 'event_created' ||
            type === 'event_notified' ||
            type === 'receive_event' ||
            type === 'event_accepted' ||
            type === 'event_declined' ||
            type === 'event_modified' ||
            type === 'task_modified' ||
            type === 'event_deleted') && (
            <h3 className={styles['notification__status']}>{title}</h3>
          )}
          <p className={styles['notification__message']}>{message}</p>
          {type.includes('event') &&
            type !== 'event_modified' &&
            type !== 'event_deleted' && (
              <p className={styles['notification__timing']}>
                {moment(beginning)
                  .tz('Europe/Zurich')
                  .format('DD.MM.YYYY HH:mm')}
                &nbsp;-&nbsp;
                {moment(end).tz('Europe/Zurich').format('DD.MM.YYYY HH:mm')}
              </p>
            )}
          {type === 'event_modified' && (
            <p className={styles['notification__timing-modification']}>
              <span>The event was displaced by the organizer.</span>
              <span>
                New date :{' '}
                {moment(beginning)
                  .tz('Europe/Zurich')
                  .format('DD.MM.YYYY HH:mm')}
                &nbsp;-&nbsp;
                {moment(end).tz('Europe/Zurich').format('DD.MM.YYYY HH:mm')}
              </span>
            </p>
          )}
          {type === 'event_deleted' && (
            <p className={styles['notification__timing-modification']}>
              <span>The event was cancelled by the organizer.</span>
              <span>
                {moment(beginning)
                  .tz('Europe/Zurich')
                  .format('DD.MM.YYYY HH:mm')}
                &nbsp;-&nbsp;
                {moment(end).tz('Europe/Zurich').format('DD.MM.YYYY HH:mm')}
              </span>
            </p>
          )}
          <FontAwesomeIcon
            className={styles['notification__close-btn']}
            icon={faXmark}
            onClick={closeHandler}
          />
          {(type === 'receive_invitation' ||
            type === 'receive_teaching_demand' ||
            type === 'receive_event') && (
            <div className={styles['notification__actions']}>
              <Button
                className={`${styles['notification__action']} ${styles['notification__action--left']}`}
                text="Refuse"
                type="button"
                onClick={refuseHandler}
              />
              {!accepted && (
                <Button
                  className={`${styles['notification__action']} ${styles['notification__action--right']}`}
                  text="Accept"
                  type="button"
                  onClick={acceptHandler}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </CSSTransition>
  );
};

Notification.propTypes = {
  /** the id of the user that sent (or to whom we sent) the notification */
  id: PropTypes.string,
  /** the username of the user that sent (or to whom we sent) the notification */
  username: PropTypes.string,
  /** the message displayed inside the notification */
  message: PropTypes.string,
  /** the status type of the notification (success or fail) */
  status: PropTypes.bool,
  /** the type of the notification (invite, delete_contact, ...) */
  type: PropTypes.string,
  /** in the case of an event notification, the title of the event */
  title: PropTypes.string,
  /** in the case of an event notification, its beginning */
  beginning: PropTypes.string,
  /** in the case of an event notification, its end */
  end: PropTypes.string,
  /** in the case of an event notification, the acceptation status of the event */
  accepted: PropTypes.bool,
  /** in the case of a task notification, the validation status of the task */
  validated: PropTypes.bool,
};

export default Notification;
