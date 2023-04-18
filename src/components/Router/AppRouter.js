import loadable from '@loadable/component';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router';

const HomeRouter = loadable(() => import('./HomeRouter'));
const ProfileRouter = loadable(() => import('./ProfileRouter'));

/**
 * Base router of the application that takes care of calling ProfileRouter or HomeRouter depending on the loging state of the user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const AppRouter = () => {
  const { isAuth } = useSelector(state => state.auth);
  return (
    <Routes>
      <Route path="*" element={isAuth ? <ProfileRouter /> : <HomeRouter />} />
    </Routes>
  );
};

AppRouter.propTypes = {};

export default AppRouter;
