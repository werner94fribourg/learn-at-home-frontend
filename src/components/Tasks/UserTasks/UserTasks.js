import {
  getDoneTasks,
  getTasks,
  getValidatedTasks,
} from '../../../store/slice/tasks';
import TaskList from '../TaskList/TaskList';
import styles from './UserTasks.module.scss';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * UserTasks component in the Tasks page, representing the displaying of the tasks lists in the page
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const UserTasks = () => {
  const {
    users: {
      me: { role },
    },
    tasks: { tasks, doneTasks, validatedTasks },
    auth: { jwt },
  } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    getTasks(jwt, role, dispatch);

    if (role === 'teacher') {
      getDoneTasks(jwt, dispatch);
      getValidatedTasks(jwt, dispatch);
    }
  }, [jwt, role, dispatch]);

  const tasksTitle =
    role === 'teacher' ? 'Ongoing student tasks' : 'My personnal tasks';

  return (
    <div className={styles.usertasks}>
      <TaskList title={tasksTitle} tasks={tasks} />
      {role === 'teacher' && (
        <Fragment>
          <TaskList title="Student tasks to control" tasks={doneTasks} />
          <TaskList title="Validated student tasks" tasks={validatedTasks} />
        </Fragment>
      )}
    </div>
  );
};

UserTasks.propTypes = {};

export default UserTasks;
