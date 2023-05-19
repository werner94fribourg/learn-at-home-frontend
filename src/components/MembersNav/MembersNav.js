import styles from './MembersNav.module.scss';
import { NavLink } from 'react-router-dom';

/**
 * Component representing the button navigation when the user navigates in the /members/* pages.
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const MembersNav = () => {
  return (
    <nav className={styles['members-nav']}>
      <NavLink
        className={({ isActive }) =>
          styles['members-nav__link'] + (isActive ? ` ${styles.active}` : '')
        }
        to="/members/all"
      >
        All participants
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          styles['members-nav__link'] + (isActive ? ` ${styles.active}` : '')
        }
        to="/members/contacts"
      >
        My contacts
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          styles['members-nav__link'] + (isActive ? ` ${styles.active}` : '')
        }
        to="/members/invitations"
      >
        {' '}
        Invitations
      </NavLink>
    </nav>
  );
};

MembersNav.propTypes = {};

export default MembersNav;
