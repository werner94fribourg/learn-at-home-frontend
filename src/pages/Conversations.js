import ConversationList from '../components/Conversations/ConversationList/ConversationList';
import OpenConversation from '../components/Conversations/OpenConversation/OpenConversation';
import SideNav from '../components/SideNav/SideNav';
import conversationsStyles from './Conversations.module.scss';
import styles from './Layout.module.scss';

/**
 * Component representing the Conversations page of the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Conversations = () => {
  return (
    <div className={styles.layout}>
      <SideNav />
      <div
        className={`${styles['layout__content']} ${conversationsStyles.conversations}`}
      >
        <ConversationList />
        <OpenConversation />
      </div>
    </div>
  );
};

Conversations.propTypes = {};

export default Conversations;
