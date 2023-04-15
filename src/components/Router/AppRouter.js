import loadable from '@loadable/component';
import { Navigate, Route, Routes } from 'react-router';

const Login = loadable(() => import('../../pages/Login'));
const NotFound = loadable(() => import('../../pages/NotFound'));
const Profile = loadable(() => import('../../pages/Profile'));

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} replace />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} replace />
    </Routes>
  );
};

export default AppRouter;
