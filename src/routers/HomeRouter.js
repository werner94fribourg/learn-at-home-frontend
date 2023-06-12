import ForgotPassword from '../components/ForgotPassword/ForgotPassword';
import loadable from '@loadable/component';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';

const Home = loadable(() => import('../pages/Home'));
const Signup = loadable(() => import('../pages/Signup'));
const Confirmation = loadable(() => import('../pages/Confirmation'));
const ConfirmationWithUrl = loadable(() =>
  import('../components/Confirmation/Confirmation/Confirmation')
);

/**
 * Router of the application (user logged out)
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const HomeRouter = () => {
  const { signed } = useSelector(state => state.auth);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/confirm/:confirmToken" element={<ConfirmationWithUrl />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<Signup />} />
      {signed && <Route path="/confirmation" element={<Confirmation />} />}
      <Route path="*" element={<Navigate to="/" replace />} replace />
    </Routes>
  );
};

HomeRouter.propTypes = {};

export default HomeRouter;
