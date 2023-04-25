import { getTasks } from '../../../store/slice/tasks';
import Button from '../../UI/Button/Button';
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import Task from './Task/Task';
import styles from './Tasks.module.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

/**
 * Tasks component in the Dashboard page, representing the list of displayed tasks (i.e. todo tasks of the supervised student if he is teacher, his own tasks otherwise)
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Tasks = () => {
  const {
    auth: { jwt },
    users: {
      me: { role },
    },
    tasks: { tasks },
  } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!tasks) getTasks(jwt, role, dispatch);
  }, [jwt, role, tasks, dispatch]);

  return (
    <div className={styles.tasks}>
      <h2 className={styles['tasks__title']}>
        {role === 'student' ? 'My tasks' : "Student's Tasks"}
      </h2>
      <div className={styles['tasks__list']}>
        {!tasks && <LoadingSpinner style={{ gridColumn: '1 / 3' }} />}
        {tasks?.map(task => (
          <Task
            key={task._id}
            name={task.title}
            status={
              !task.done ? 'todo' : !task.validated ? 'done' : 'validated'
            }
            executor={task.performer}
          />
        ))}
      </div>
      <Link className={styles['tasks__link']} to="/tasks">
        <Button
          className={styles['tasks__link-btn']}
          type="button"
          text="View tasks"
        />
      </Link>
    </div>
  );
};

Tasks.propTypes = {};

export default Tasks;
