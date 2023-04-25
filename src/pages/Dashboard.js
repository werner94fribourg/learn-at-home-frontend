import Events from '../components/Dashboard/Events/Events';
import Messages from '../components/Dashboard/Messages/Messages';
import Students from '../components/Dashboard/Students/Students';
import Tasks from '../components/Dashboard/Tasks/Tasks';
import styles from './Dashboard.module.scss';
import { useSelector } from 'react-redux';

/**
 * Component representing the Dashboard page of the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Dashboard = () => {
  const {
    me: { role },
  } = useSelector(state => state.users);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles['dashboard__title']}>Dashboard</h1>
      <Messages className={styles['dashboard__messages']} />
      <Events />
      <Tasks />
      {role === 'teacher' && <Students />}
    </div>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
