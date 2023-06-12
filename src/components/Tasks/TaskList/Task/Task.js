import { logout } from '../../../../store/slice/auth';
import { finishTask, validateStudentTask } from '../../../../store/slice/tasks';
import { getSocket } from '../../../../utils/utils';
import styles from './Task.module.scss';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Task component in the TaskList, representing a task item in the list
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Task = props => {
  const {
    id,
    status,
    name,
    executor: { username },
  } = props;
  const {
    users: {
      me: { _id, role, supervisor },
    },
    auth: { jwt },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const socket = getSocket();

  let checkBoxClasses = styles['task__checkbox'];

  if (status !== 'todo') checkBoxClasses += ` ${styles.checked}`;

  const finishHandler = async () => {
    if (role === 'teacher') return;
    const [valid, authorized, task] = await finishTask(jwt, id, dispatch);
    if (!authorized) {
      logout(dispatch);
      return;
    }
    if (valid) {
      const finishedTask = { ...task, performer: { _id, username } };
      socket.emit('complete_task', { supervisor, task: finishedTask });
    }
  };

  const validateHandler = async () => {
    if (role === 'student') return;
    const [valid, authorized, task] = await validateStudentTask(
      jwt,
      id,
      dispatch
    );
    if (!authorized) {
      logout(dispatch);
      return;
    }
    if (valid) socket.emit('validate_task', task);
  };

  const emptyHandler = () => {};

  const clickHandler =
    status === 'todo'
      ? finishHandler
      : status === 'done'
      ? validateHandler
      : emptyHandler;

  return (
    <div className={`${styles.task} ${styles[status]}`} onClick={clickHandler}>
      <h3 className={styles['task__title']}>
        <span className={checkBoxClasses}></span>
        <span>
          {name}{' '}
          {role === 'teacher' && (
            <Fragment>
              <br />({username})
            </Fragment>
          )}
        </span>
      </h3>
    </div>
  );
};

Task.propTypes = {
  /** the id of the task */
  id: PropTypes.string,
  /** the name of the task */
  name: PropTypes.string,
  /** the completion status of the task (todo, done or validated) */
  status: PropTypes.string,
  /** the user executing the task */
  executor: PropTypes.object,
};

export default Task;
