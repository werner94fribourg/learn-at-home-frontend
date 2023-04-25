import Layout from '../Layout/Layout';
import loadable from '@loadable/component';
import { Navigate, Route, Routes } from 'react-router';

const Dashboard = loadable(() => import('../../pages/Dashboard'));
const Profile = loadable(() => import('../../pages/Profile'));

/**
 * Router of the application (user logged in)
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const ProfileRouter = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} replace />
      </Routes>
    </Layout>
  );
};

ProfileRouter.propTypes = {};

export default ProfileRouter;
