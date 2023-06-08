import Task from './Task/Task';
import styles from './TaskList.module.scss';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

/**
 * TaskList component in the UserTasks, representing a task list and its collapse behavior
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const TaskList = props => {
  const [visible, setVisible] = useState(false);
  const [rotated, setRotated] = useState(false);
  const { title, tasks } = props;

  const stateHandler = () => {
    setVisible(prevState => !prevState);
    setRotated(prevState => !prevState);
  };

  const iconRef = useRef(null);
  const tasklistRef = useRef(null);

  return (
    <div className={styles.tasklist}>
      <div className={styles['tasklist__header']}>
        <h2 className={styles['tasklist__title']}>
          <button
            className={styles['tasklist__title-btn']}
            onClick={stateHandler}
          >
            {title}
          </button>
        </h2>
        <CSSTransition
          nodeRef={iconRef}
          in={rotated}
          timeout={300}
          classNames={{
            enter: styles['tasklist__icon-enter'],
            enterActive: styles['tasklist__icon-enter-active'],
            enterDone: styles['tasklist__icon-enter-done'],
            exit: styles['tasklist__icon-exit'],
            exitActive: styles['tasklist__icon-exit-active'],
            exitDone: styles['tasklist__icon-exit-done'],
          }}
        >
          <FontAwesomeIcon
            className={styles['tasklist__icon']}
            icon={faChevronDown}
            ref={iconRef}
          />
        </CSSTransition>
      </div>
      <CSSTransition
        nodeRef={tasklistRef}
        in={visible}
        timeout={300}
        classNames={{
          enter: styles['tasklist__content-enter'],
          enterActive: styles['tasklist__content-enter-active'],
          enterDone: styles['tasklist__content-enter-done'],
          exit: styles['tasklist__content-exit'],
          exitActive: styles['tasklist__content-exit-active'],
          exitDone: styles['tasklist__content-exit-done'],
        }}
        mountOnEnter
        unmountOnExit
      >
        <div ref={tasklistRef} className={styles['tasklist__content']}>
          {tasks.map(task => (
            <Task
              key={task._id}
              id={task._id}
              name={task.title}
              status={
                !task.done ? 'todo' : !task.validated ? 'done' : 'validated'
              }
              executor={task.performer}
            />
          ))}
        </div>
      </CSSTransition>
    </div>
  );
};

TaskList.propTypes = {
  /** The title displayed in the collapse */
  title: PropTypes.string,
  /** The array of tasks we want to display in the list */
  tasks: PropTypes.arrayOf(PropTypes.object),
};

export default TaskList;
