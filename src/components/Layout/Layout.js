import { navbarActions } from '../../store/slice/navbar';
import Navbar from '../Navbar/Navbar';
import styles from './Layout.module.scss';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Layout component, containing the navbar and the content of a page once the user is logged in
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Layout = props => {
  const { isOpen } = useSelector(state => state.navbar);
  const dispatch = useDispatch();

  let classNames = styles.main;

  if (isOpen) classNames += ` ${styles['navbar-open']}`;

  const closeNavbarHandler = () => {
    dispatch(navbarActions.setClosedState());
  };

  return (
    <Fragment>
      <Navbar />
      <main className={classNames} onClick={closeNavbarHandler}>
        <div className={styles.content}>{props.children}</div>
      </main>
    </Fragment>
  );
};

Layout.propTypes = {
  /** the child component accepted by the Layout one */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Layout;
