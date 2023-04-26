import { logout } from '../../../../store/slice/auth';
import { getMessages } from '../../../../store/slice/messages';
import LoadingSpinner from '../../../UI/LoadingSpinner/LoadingSpinner';
import Message from '../Message/Message';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Messages component in the OpenConversation component, representing the currently displayed messages in the conversation
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Messages = props => {
  const {
    users: {
      me: { _id },
      activeUser: { id: activeUser },
    },
    messages: { messages, loading, loadPage, page },
    auth: { jwt },
  } = useSelector(state => state);
  const { className } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    const getConversation = async () => {
      if (!jwt) return;

      const { authorized } = await getMessages(jwt, activeUser, dispatch);
      if (!authorized) logout(dispatch);
    };

    getConversation();
  }, [jwt, activeUser, dispatch]);

  if (!messages || loading) return <LoadingSpinner />;

  if (messages === null) return <h3>Something went wrong.</h3>;

  const scrollHandler = async event => {
    const scrollPosition = Math.abs(event.target.scrollTop);
    const maxScroll = event.target.scrollHeight - event.target.clientHeight;
    if (scrollPosition >= maxScroll - 20 && !loadPage && page !== -1) {
      await getMessages(jwt, activeUser, dispatch, page);
    }
  };
  return (
    <div className={className} onScroll={scrollHandler}>
      {messages.map(message => {
        const own = message.sender._id === _id;
        return (
          <Message
            key={message._id}
            user={message[own ? 'receiver' : 'sender']}
            files={message.files}
            own={own}
            content={message.content}
            sent={message.sent}
            read={message.read}
          />
        );
      })}
    </div>
  );
};

Messages.propTypes = {
  /** The class(es) we want to associate with the Messages component */
  className: PropTypes.string,
};

export default Messages;
