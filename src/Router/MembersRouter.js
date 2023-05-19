import MembersNav from '../components/MembersNav/MembersNav';
import { getContacts, getInvitations } from '../store/slice/users';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';

const Members = loadable(() => import('../components/Members/Members'));
const Contacts = loadable(() => import('../components/Contacts/Contacts'));
const Invitations = loadable(() =>
  import('../components/Invitations/Invitations')
);

/**
 * Router of the /members/* pages (user logged in)
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const MembersRouter = props => {
  const { className, listClassName } = props;
  const { jwt } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!jwt) return;
    getContacts(jwt, dispatch);
    getInvitations(jwt, dispatch);
  }, [jwt, dispatch]);

  return (
    <Fragment>
      <MembersNav />
      <div className={className}>
        <div className={listClassName}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/members/all" replace />}
              replace
            />
            <Route path="/all" element={<Members />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/invitations" element={<Invitations />} />
            <Route path="*" element={<Navigate to="/" replace />} replace />
          </Routes>
        </div>
      </div>
    </Fragment>
  );
};

MembersRouter.propTypes = {
  /** the classes we want to apply to the content of the page */
  className: PropTypes.string,
  /** the classes we want to apply to the list of users in the page */
  listClassName: PropTypes.string,
};

export default MembersRouter;
