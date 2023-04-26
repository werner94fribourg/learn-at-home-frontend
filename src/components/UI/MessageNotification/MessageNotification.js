import styles from './MessageNotification.module.scss';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

/**
 * Component representing a notification when a message is sent to the connected user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const MessageNotification = props => {
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState(false);
  useEffect(() => {
    if (!visible && !displayed) {
      setVisible(true);
      setDisplayed(true);
      setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
  }, [visible, setVisible, displayed, setDisplayed]);
  const {
    message: {
      sender: { username, photo },
      content,
      files,
    },
    style,
  } = props;
  const messageRef = useRef(null);

  return (
    <CSSTransition
      nodeRef={messageRef}
      timeout={1000}
      in={visible}
      classNames={{
        enter: styles['notification-enter'],
        enterActive: styles['notification-enter-active'],
        enterDone: styles['notification-enter-done'],
        exit: styles['notification-exit'],
        exitActive: styles['notification-exit-active'],
        exitDone: styles['notification-exit-done'],
      }}
      mountOnEnter
      unmountOnExit
    >
      <div className={styles.notification} ref={messageRef} style={style}>
        <div className={styles['notification__sender']}>
          <img
            className={styles['notification__sender-picture']}
            src={photo}
            alt={photo}
          />
          <h2 className={styles['notification__sender-username']}>
            {username}
          </h2>
        </div>
        <div className={styles['notification__content']}>
          {content && (
            <p className={styles['notification__paragraph']}>{content}</p>
          )}
          {files?.length > 0 && (
            <p className={styles['notification__paragraph']}>
              <FontAwesomeIcon
                className={styles['notification__file']}
                icon={faFile}
              />
              {files[0]}
              {files.length > 1 && (
                <span>{` and ${files.length - 1} other files`}</span>
              )}
            </p>
          )}
        </div>
      </div>
    </CSSTransition>
  );
};

MessageNotification.propTypes = {
  /** the message object we want to display in the notification */
  message: PropTypes.object,
  /** The custom inline styles we want to associate to the notification */
  style: PropTypes.object,
};

export default MessageNotification;
