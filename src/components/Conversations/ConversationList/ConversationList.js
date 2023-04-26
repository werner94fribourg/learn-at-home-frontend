import { logout } from '../../../store/slice/auth';
import {
  getLastConversations,
  getTotalUnread,
  search,
  selectConversation,
  setConversationUnread,
} from '../../../store/slice/messages';
import { setActiveUser } from '../../../store/slice/users';
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import Conversation from './Conversation/Conversation';
import styles from './ConversationList.module.scss';
import {
  faChevronDown,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * ConversationList component in the Conversations page, representing the list of existing conversations
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const ConversationList = () => {
  const {
    auth: { jwt },
    users: {
      me: { _id: id, username },
      activeUser: { id: activeUser },
    },
    messages: { displayed: conversations },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);
  const searchInputRef = useRef(null);
  const [open, setOpen] = useState(false);

  if (!conversations && !initialized) {
    getLastConversations(jwt, dispatch).then(authorized => {
      if (!authorized) logout(dispatch);

      setInitialized(true);
    });
  }
  useEffect(() => {
    const start = async () => {
      if (!jwt) return;

      if (id && !activeUser && conversations?.length > 0) {
        const [
          {
            sender,
            receiver,
            _id: { sender: senderUsername, receiver: receiverUsername },
          },
        ] = conversations;
        setActiveUser(
          sender === id
            ? { id: receiver, username: receiverUsername }
            : { id: sender, username: senderUsername },
          dispatch
        );
        selectConversation(
          sender === id
            ? { id: receiver, username: receiverUsername }
            : { id: sender, username: senderUsername },
          dispatch
        );
        await getTotalUnread(jwt, dispatch);

        setConversationUnread(sender, receiver, 0, dispatch);
      }
    };
    start();
  }, [id, activeUser, conversations, jwt, dispatch]);

  const conversationHandler = async (user, sender, receiver) => {
    setActiveUser(user, dispatch);
    selectConversation(user, dispatch);
    await getTotalUnread(jwt, dispatch);
    setConversationUnread(sender, receiver, 0, dispatch);
  };

  const searchHandler = () => {
    const {
      current: { value },
    } = searchInputRef;

    search(username, value, dispatch);
  };

  const displayHandler = () => {
    setOpen(prevState => !prevState);
  };

  let containerClassNames = styles['conversation-list__container'];

  if (open) containerClassNames += ` ${styles.open}`;

  return (
    <div className={containerClassNames}>
      <div
        className={styles['conversation-list__display']}
        onClick={displayHandler}
      >
        <h2 className={styles['conversation-list__display-title']}>
          Conversations
        </h2>
        <FontAwesomeIcon
          className={styles['conversation-list__display-icon']}
          icon={faChevronDown}
        />
      </div>
      <div className={styles['conversation-list']}>
        <form
          className={styles['conversation-list__form']}
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <FontAwesomeIcon
            className={styles['conversation-list__search']}
            icon={faMagnifyingGlass}
          />
          <input
            className={styles['conversation-list__input']}
            type="text"
            name="search"
            placeholder="Search a conversation"
            ref={searchInputRef}
            onChange={searchHandler}
          />
          <div className={styles['conversation-list__filter']}>
            <FontAwesomeIcon icon={faFilter} />
          </div>
        </form>
        {!conversations && <LoadingSpinner style={{ padding: '10rem' }} />}
        {conversations?.map(conversation => {
          const other = conversation.sender === id ? 'receiver' : 'sender';
          const otherUsername = conversation._id[other];
          return (
            <Conversation
              key={conversation[other]}
              id={conversation._id}
              sender={conversation.sender}
              receiver={conversation.receiver}
              content={conversation.content}
              photo={conversation[`${other}Photo`]}
              sent={conversation.sent}
              read={conversation.read}
              files={conversation.file}
              active={activeUser === conversation[other]}
              onClick={conversationHandler.bind(
                null,
                {
                  id: conversation[other],
                  username: otherUsername,
                },
                conversation.sender,
                conversation.receiver
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

ConversationList.propTypes = {};

export default ConversationList;
