import { SITE_URL, USERS_URL } from '../../utils/globals';
import loadable from '@loadable/component';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';

const Profile = loadable(() => import('../../pages/Profile'));

/**
 * Router of the application (user logged in)
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const ProfileRouter = () => {
  const { jwt } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(USERS_URL + '/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          'Access-Control-Allow-Origin': SITE_URL,
          Authorization: `Bearer ${jwt}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      console.log(data);
    };

    fetchUser();
  }, [jwt]);

  return (
    <Routes>
      <Route path="/" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} replace />
    </Routes>
  );
};

ProfileRouter.propTypes = {};

export default ProfileRouter;
