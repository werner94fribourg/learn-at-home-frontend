import './App.scss';
import AppRouter from './components/Router/AppRouter';
import { initialize } from './store/slice/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

/**
 * Root component of the react application.
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');

    if (jwt) initialize(jwt, dispatch);
  }, [dispatch]);
  return <AppRouter />;
};

App.propTypes = {};

export default App;
