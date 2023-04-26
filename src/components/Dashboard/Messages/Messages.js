import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import styles from './Messages.module.scss';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

/**
 * Messages component in the Dashboard page, representing the box informing the number of unread messages by the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Messages = () => {
  const { totalUnread } = useSelector(state => state.messages);

  if (totalUnread === -1) return <LoadingSpinner style={{ padding: '0' }} />;

  return (
    <Link className={styles.messages} to="/conversations">
      {totalUnread >= 0 && (
        <Fragment>
          <h2 className={styles['messages__title']}>
            You have {totalUnread} unread messages.
          </h2>
          <p className={styles['messages__description']}>
            Click here to be redirected to the chat interface.
          </p>
        </Fragment>
      )}
      {totalUnread < 0 && (
        <h2 className={styles['messages__title']}>Something went wrong.</h2>
      )}
    </Link>
  );
};

Messages.propTypes = {};

export default Messages;
