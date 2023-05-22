import ForgotPassword from '../components/ForgotPassword/ForgotPassword';
import Signup from '../components/Signup/Signup';
import loadable from '@loadable/component';
import { Navigate, Route, Routes } from 'react-router';

const Home = loadable(() => import('../pages/Home'));

/**
 * Router of the application (user logged out)
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const HomeRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} replace />
    </Routes>
  );
};

HomeRouter.propTypes = {};

export default HomeRouter;
