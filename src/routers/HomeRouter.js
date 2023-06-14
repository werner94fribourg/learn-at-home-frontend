import loadable from '@loadable/component';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';

const Home = loadable(() => import('../pages/Home'));
const Signup = loadable(() => import('../pages/Signup'));
const ForgotPassword = loadable(() => import('../pages/ForgotPassword'));
const Confirmation = loadable(() => import('../pages/Confirmation'));
const ConfirmationWithUrl = loadable(() =>
  import('../components/Confirmation/Confirmation/Confirmation')
);
const ResetPassword = loadable(() => import('../pages/ResetPassword'));

/**
 * Router of the application (user logged out)
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const HomeRouter = () => {
  const { confirmed } = useSelector(state => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/confirm/:confirmToken" element={<ConfirmationWithUrl />} />
      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<Signup />} />
      {confirmed && <Route path="/confirmation" element={<Confirmation />} />}
      <Route path="*" element={<Navigate to="/" replace />} replace />
    </Routes>
  );
};

HomeRouter.propTypes = {};

export default HomeRouter;
