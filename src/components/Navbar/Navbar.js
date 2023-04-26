import { logout } from '../../store/slice/auth';
import { navbarActions } from '../../store/slice/navbar';
import styles from './Navbar.module.scss';
import UnreadCount from './UnreadCount';
import {
  faArrowRightFromBracket,
  faBars,
  faCalendarDays,
  faComment,
  faGraduationCap,
  faSquarePlus,
  faTableColumns,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

/**
 * Component representing the navbar in the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Navbar = props => {
  const { style } = props;
  const {
    users: {
      me: { photo, username },
    },
    navbar: { isOpen },
  } = useSelector(state => state);
  const dispatch = useDispatch();

  let linksClassNames = styles['navbar__links'];

  if (isOpen) linksClassNames += ` ${styles['navbar-open']}`;

  const openNavbarHandler = () => {
    dispatch(navbarActions.setOpenState());
  };

  const logoutHandler = event => {
    event.preventDefault();
    logout(dispatch);
  };

  return (
    <nav className={styles.navbar} style={style}>
      <NavLink className={styles['navbar__brand']} to="/">
        Learn@Home
      </NavLink>
      <FontAwesomeIcon
        className={styles['navbar__toggle-btn']}
        icon={isOpen ? faXmark : faBars}
        onClick={openNavbarHandler}
      />
      <div className={linksClassNames}>
        <NavLink
          className={({ isActive }) =>
            styles['navbar__link'] + (isActive ? ` ${styles.active}` : '')
          }
          to="/"
        >
          <FontAwesomeIcon
            className={styles['navbar__link-icon']}
            icon={faTableColumns}
          />
          <span className={styles['navbar__link-title']}> Dashboard</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            styles['navbar__link'] + (isActive ? ` ${styles.active}` : '')
          }
          to="/conversations"
        >
          <FontAwesomeIcon
            className={styles['navbar__link-icon']}
            icon={faComment}
          />
          <UnreadCount className={styles['navbar__link-unread']} />
          <span
            className={`${styles['navbar__link-title']} ${styles['navbar__link-title--chat-desktop']}`}
          >
            {' '}
            Chat
          </span>
          <span
            className={`${styles['navbar__link-title']} ${styles['navbar__link-title--chat-mobile']}`}
          >
            {' '}
            Conversations
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${styles['navbar__link']} ${styles['navbar__link--member']}` +
            (isActive ? ` ${styles.active}` : '')
          }
          to="/teaching"
        >
          <FontAwesomeIcon
            className={styles['navbar__link-icon']}
            icon={faGraduationCap}
          />
          <span className={styles['navbar__link-title']}>
            {' '}
            Teaching demands
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${styles['navbar__link']} ${styles['navbar__link--member']}` +
            (isActive ? ` ${styles.active}` : '')
          }
          to="/members"
        >
          <FontAwesomeIcon
            className={styles['navbar__link-icon']}
            icon={faUser}
          />
          <span className={styles['navbar__link-title']}> Members</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            styles['navbar__link'] + (isActive ? ` ${styles.active}` : '')
          }
          to="/calendar"
        >
          <FontAwesomeIcon
            className={styles['navbar__link-icon']}
            icon={faCalendarDays}
          />
          <span className={styles['navbar__link-title']}> Calendar</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            styles['navbar__link'] + (isActive ? ` ${styles.active}` : '')
          }
          to="/tasks"
        >
          <FontAwesomeIcon
            className={styles['navbar__link-icon']}
            icon={faSquarePlus}
          />
          <span className={styles['navbar__link-title']}> Tasks</span>
        </NavLink>
        <NavLink
          className={`${styles['navbar__link']} ${styles['navbar__link--profile']}`}
          to="/profile"
        >
          <img src={photo} alt="Profile" />
          <span className={styles['navbar__link-title']}> {username}</span>
        </NavLink>
        <a
          className={`${styles['navbar__link']} ${styles['navbar__logout']}`}
          href="/logout"
          onClick={logoutHandler}
        >
          <FontAwesomeIcon
            className={styles['navbar__link-icon']}
            icon={faArrowRightFromBracket}
          />
          <span className={styles['navbar__link-title']}> Logout</span>
        </a>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  /** The custom inline styles we want to associate to the navbar */
  style: PropTypes.object,
};

export default Navbar;
