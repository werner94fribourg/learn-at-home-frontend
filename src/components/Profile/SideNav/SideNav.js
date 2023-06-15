import { setActivePeriod } from '../../../utils/utils';
import styles from './SideNav.module.scss';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

/**
 * SideNav component in the ProfilePage, representing the navigation icons to access the different modification forms
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const SideNav = props => {
  const { status, onNavClick } = props;
  setActivePeriod(
    !status,
    styles['sidenav__item'],
    styles['sidenav__item--active']
  );
  return (
    <nav className={styles.sidenav}>
      <ul className={styles['sidenav__list']}>
        <li
          className={setActivePeriod(
            !status,
            styles['sidenav__item'],
            styles['sidenav__item--active']
          )}
          onClick={onNavClick.bind(null, false)}
        >
          <FontAwesomeIcon className={styles['sidenav__icon']} icon={faUser} />
          Profile
        </li>
        <li
          className={setActivePeriod(
            status,
            styles['sidenav__item'],
            styles['sidenav__item--active']
          )}
          onClick={onNavClick.bind(null, true)}
        >
          <FontAwesomeIcon className={styles['sidenav__icon']} icon={faKey} />
          Password
        </li>
      </ul>
    </nav>
  );
};

SideNav.propTypes = {
  /** the profile link active status of the navigation bar */
  status: PropTypes.bool,
  /** the handler function called when the user clicks on a navigation link */
  onNavClick: PropTypes.func,
};

export default SideNav;
