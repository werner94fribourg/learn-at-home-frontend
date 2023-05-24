import SideNav from '../components/SideNav/SideNav';
import MembersRouter from '../routers/MembersRouter';
import { getMembers } from '../store/slice/users';
import styles from './Layout.module.scss';
import membersStyles from './Members.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

/**
 * Component representing the Members pages (all, contacts, invitations) of the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Members = () => {
  const { loadPage, page } = useSelector(state => state.users);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const scrollHandler = async event => {
    const scrollPosition =
      Math.abs(event.target.scrollTop) + event.target.clientHeight;
    const maxScroll = event.target.scrollHeight;

    if (scrollPosition >= maxScroll - 20 && !loadPage && page !== -1)
      switch (pathname) {
        case '/members/all':
          await getMembers(dispatch, page);
          break;
        default:
          break;
      }
  };

  return (
    <div className={styles.layout}>
      <SideNav />
      <div
        className={`${styles['layout__content']} ${membersStyles.members}`}
        onScroll={scrollHandler}
      >
        <MembersRouter
          className={membersStyles['members__content']}
          listClassName={membersStyles['members__list']}
        />
      </div>
    </div>
  );
};

Members.propTypes = {};

export default Members;
