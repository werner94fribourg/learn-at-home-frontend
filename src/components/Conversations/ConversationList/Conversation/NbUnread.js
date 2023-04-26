import { getUnreadForConversation } from '../../../../store/slice/messages';
import styles from './Conversation.module.scss';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * NbUnread component in the Conversation component, displaying the number of unread messages by the connected user in this conversation
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const NbUnread = props => {
  const { token, id, sender, receiver } = props;
  const { messageUnreads } = useSelector(state => state.messages);
  const unreadData = messageUnreads?.find(
    mess => mess.sender === sender && mess.receiver === receiver
  );
  const totalUnread = unreadData?.totalUnread;

  const dispatch = useDispatch();
  useEffect(() => {
    if (totalUnread === undefined) {
      if (!token) return;
      getUnreadForConversation(token, sender, receiver, id, dispatch);
    }
  }, [token, totalUnread, id, sender, receiver, dispatch]);

  if (!totalUnread) return undefined;

  return (
    <span className={styles['conversation__nb-unread']}>{totalUnread}</span>
  );
};

NbUnread.propTypes = {
  /** the jwt token used to get the number of unread messages in a conversation */
  token: PropTypes.string,
  /** the id of the user from which we want to retrieve the number of unread messages */
  id: PropTypes.string,
  /** the sender of the last message in the conversation */
  sender: PropTypes.string,
  /** the receiver of the last message in the conversation */
  receiver: PropTypes.string,
};

export default NbUnread;
