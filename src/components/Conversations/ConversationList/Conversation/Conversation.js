import styles from './Conversation.module.scss';
import DisplayedTime from './DisplayedTime';
import NbUnread from './NbUnread';
import { faCheck, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

/**
 * Conversation component in the Conversations page, representing an existing conversation displayed in the conversation's list
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Conversation = props => {
  const {
    auth: { jwt },
    users: {
      me: { _id },
      activeUser: { id: activeUser },
    },
  } = useSelector(state => state);

  const {
    id: { sender: senderUsername, receiver: receiverUsername },
    sender,
    receiver,
    content,
    photo,
    sent,
    read,
    files,
    active,
    onClick,
  } = props;

  const username = _id === sender ? receiverUsername : senderUsername;

  let conversationClassNames = styles.conversation;

  if (activeUser === sender || activeUser === receiver)
    conversationClassNames += ` ${styles['conversation--active']}`;

  let contentClassNames = styles['conversation__content'];

  if (_id !== sender && !read)
    contentClassNames += ` ${styles['conversation__content--unread']}`;

  let conversationViewClassNames = styles['conversation__view'];

  if (read)
    conversationViewClassNames += ` ${styles['conversation__view--read']}`;

  return (
    <div className={conversationClassNames} onClick={onClick}>
      <img
        className={styles['conversation__photo']}
        src={photo}
        alt={`${username}`}
      />
      <div className={styles['conversation__description']}>
        <h2 className={styles['conversation__username']}>{username}</h2>
        {content && <p className={contentClassNames}>{content}</p>}
        {!content && files?.length > 0 && (
          <p className={contentClassNames}>
            {' '}
            <FontAwesomeIcon
              className={styles['conversation__file']}
              icon={faFile}
            />
            {files[0]}
            {files.length > 1 && (
              <span>{` and ${files.length - 1} other files`}</span>
            )}
          </p>
        )}
      </div>
      <DisplayedTime
        className={styles['conversation__sent-time']}
        sent={sent}
      />
      {_id === sender && (
        <span className={conversationViewClassNames}>
          <FontAwesomeIcon
            className={`${styles['conversation__check']} ${styles['conversation__check--left']}`}
            icon={faCheck}
          />
          <FontAwesomeIcon
            className={`${styles['conversation__check']} ${styles['conversation__check--right']}`}
            icon={faCheck}
          />
        </span>
      )}
      {_id !== sender && !read && !active && (
        <NbUnread
          token={jwt}
          id={_id === sender ? receiver : sender}
          sender={sender}
          receiver={receiver}
        />
      )}
    </div>
  );
};

Conversation.propTypes = {
  /** the id of the conversation, containing the sender and the receiver's usernames */
  id: PropTypes.object,
  /** the id of the sender */
  sender: PropTypes.string,
  /** the id of the receiver */
  receiver: PropTypes.string,
  /** the content of the last message emitted in the conversation */
  content: PropTypes.string,
  /** the url of the profile picture of the other user participating in the conversation (not the logged one) */
  photo: PropTypes.string,
  /** the moment when the message was sent (in ISO format) */
  sent: PropTypes.string,
  /** the read status of the message (i.e. false if the receiver hasn't read it, true otherwise) */
  read: PropTypes.bool,
  /** the list of the attached files' urls */
  files: PropTypes.arrayOf(PropTypes.string),
  /** the activation status of the conversation (true if the user is actually opening a conversation with that respective user) */
  active: PropTypes.bool,
  /** the handler function that will be called when the user clicks on the conversation */
  onClick: PropTypes.func,
};

export default Conversation;
