import NewTaskForm from '../components/Tasks/NewTaskForm/NewTaskForm';
import UserTasks from '../components/Tasks/UserTasks/UserTasks';
import styles from './Tasks.module.scss';

/**
 * Component representing the Tasks page of the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Tasks = () => {
  return (
    <div className={styles.tasks}>
      <h1 className={styles['tasks__title']}>Task Management</h1>
      <NewTaskForm />
      <UserTasks />
    </div>
  );
};

Tasks.propTypes = {};

export default Tasks;
