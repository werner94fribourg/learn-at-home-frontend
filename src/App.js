import './App.scss';
import AppRouter from './Router/AppRouter';
import LoadingSpinner from './components/UI/LoadingSpinner/LoadingSpinner';
import { initialize } from './store/slice/auth';
import { getMe } from './store/slice/users';
import { getSocket } from './utils/utils';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Root component of the react application.
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const App = () => {
  const { jwt } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.users);
  const dispatch = useDispatch();
  useEffect(() => {
    const setup = async () => {
      const token = jwt || localStorage.getItem('jwt');
      if (await getMe(token, dispatch)) initialize(token, dispatch);
      else localStorage.removeItem('jwt');
    };

    setup();
  }, [jwt, dispatch]);

  const disconnectSocket = useCallback(event => {
    event.preventDefault();
    const socket = getSocket();
    if (socket) socket.disconnect();
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', disconnectSocket);
  }, [disconnectSocket]);

  if (loading) return <LoadingSpinner />;

  return <AppRouter />;
};

App.propTypes = {};

export default App;
