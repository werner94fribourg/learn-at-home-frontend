import styles from './Task.module.scss';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';

/**
 * Task component in the Dashboard page, representing a task displayed in the list of tasks
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Task = props => {
  const {
    status,
    name,
    executor: { username },
  } = props;
  const {
    me: { role },
  } = useSelector(state => state.users);

  let checkBoxClasses = styles['task__checkbox'];

  if (status !== 'todo') checkBoxClasses += ` ${styles.checked}`;

  return (
    <div className={`${styles.task} ${styles[status]}`}>
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
  /** The execution status of the task */
  status: PropTypes.string,
  /** The name of the task */
  name: PropTypes.string,
  /** the user object of the executor of the task */
  executor: PropTypes.object,
};

export default Task;
