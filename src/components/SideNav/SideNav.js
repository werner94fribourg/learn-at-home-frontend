import UnreadCount from '../Navbar/UnreadCount';
import styles from './SideNav.module.scss';
import {
  faComment,
  faGraduationCap,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * Component representing the side navigation when the user navigates in the /chat, /members or /teaching page
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const SideNav = () => {
  const {
    me: { photo, username },
  } = useSelector(state => state.users);
  const { pathname } = useLocation();

  return (
    <nav className={styles.sidenav}>
      <h1 style={{ visibility: 'hidden', position: 'absolute' }}>
        {pathname === '/conversations'
          ? 'Conversations'
          : `Members - ${
              pathname === '/members/all'
                ? 'All participants'
                : pathname === '/members/contacts'
                ? 'My contacts'
                : 'Invitations'
            }`}
      </h1>
      <NavLink
        className={`${styles['sidenav__link']} ${styles['sidenav__link--profile']}`}
        to="/profile"
      >
        <img src={photo} alt="Profile" />
        <span>{username}</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          styles['sidenav__link'] + (isActive ? ` ${styles.active}` : '')
        }
        to="/conversations"
      >
        <FontAwesomeIcon
          className={styles['sidenav__link-icon']}
          icon={faComment}
        />
        <UnreadCount className={styles['sidenav__link-unread']} />
        <span className={styles['sidenav__link-title']}> Conversations</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          styles['sidenav__link'] + (isActive ? ` ${styles.active}` : '')
        }
        to="/teaching"
      >
        <FontAwesomeIcon
          className={styles['sidenav__link-icon']}
          icon={faGraduationCap}
        />
        <span className={styles['sidenav__link-title']}> Teaching demands</span>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          styles['sidenav__link'] + (isActive ? ` ${styles.active}` : '')
        }
        to="/members"
      >
        <FontAwesomeIcon
          className={styles['sidenav__link-icon']}
          icon={faUser}
        />
        <span className={styles['sidenav__link-title']}> Members</span>
      </NavLink>
    </nav>
  );
};

SideNav.propTypes = {};

export default SideNav;
