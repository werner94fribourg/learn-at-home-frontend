import DisplayedTime from '../../ConversationList/Conversation/DisplayedTime';
import styles from './Message.module.scss';
import { faCheck, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

/**
 * Message component in the OpenConversation component, representing a displayed message
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Message = props => {
  const { user, files, own, content, sent, read } = props;
  const extensionRegex = /(?:\.([^.]+))?$/;
  const { username, photo } = user;
  return (
    <div
      className={`${styles.message} ${
        styles[`message--${own ? 'own' : 'other'}`]
      }`}
    >
      {!own && (
        <img
          className={styles['message__photo']}
          src={photo}
          alt={`${username}`}
        />
      )}
      <p className={styles['message__content']}>{content}</p>
      {files.length > 0 &&
        files.map(file => {
          const extension = extensionRegex.exec(file)[1];

          const content =
            extension.toLowerCase() === 'jpg' ||
            extension.toLowerCase() === 'png' ? (
              <img
                className={styles['message__picture-file']}
                src={file}
                alt={file}
              />
            ) : (
              <span className={styles['message__file']}>
                <FontAwesomeIcon
                  className={styles['message__file-icon']}
                  icon={faFile}
                />{' '}
                {file.split('/').pop()}
              </span>
            );
          return (
            <a key={file} href={file} download>
              {content}
            </a>
          );
        })}
      <DisplayedTime className={styles['message__time']} sent={sent} />
      {own && (
        <span
          className={`${styles['message__view']}${
            read ? ` ${styles['message__view--read']}` : ''
          }`}
        >
          <FontAwesomeIcon
            className={`${styles['message__check']} ${styles['message__check--left']}`}
            icon={faCheck}
          />
          <FontAwesomeIcon
            className={`${styles['message__check']} ${styles['message__check--right']}`}
            icon={faCheck}
          />
        </span>
      )}
    </div>
  );
};

Message.propTypes = {
  /** the user that sents the message (username and photo) */
  user: PropTypes.object,
  /** the list of the attached files' urls */
  files: PropTypes.arrayOf(PropTypes.string),
  /** a boolean representing if the message was sent by the logged user or not */
  own: PropTypes.bool,
  /** the content of the message */
  content: PropTypes.string,
  /** the moment when the message was sent (in ISO format) */
  sent: PropTypes.string,
  /** the read status of the message (i.e. false if the receiver hasn't read it, true otherwise) */
  read: PropTypes.bool,
};

export default Message;
