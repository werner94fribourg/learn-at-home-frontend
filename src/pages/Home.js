import Description from '../components/Home/Description/Description';
import Login from '../components/Home/Login/Login';
import styles from './Home.module.scss';

/**
 * Component representing the Home page of the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Home = () => {
  return (
    <main className={styles.home}>
      <Description />
      <Login />
    </main>
  );
};

Home.propTypes = {};

export default Home;
