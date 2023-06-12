import { logout } from '../../../store/slice/auth';
import {
  createSupervisedStudentTask,
  createTask,
  notifyTask,
} from '../../../store/slice/tasks';
import { getStudents } from '../../../store/slice/users';
import { getSocket } from '../../../utils/utils';
import Button from '../../UI/Button/Button';
import Select from '../../UI/Select/Select';
import styles from './NewTaskForm.module.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * NewTaskForm component in the Tasks page, representing the form used to create a new task
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const NewTaskForm = () => {
  const {
    users: {
      me: { role, username, supervisor },
      me,
      students,
    },
    auth: { jwt },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const socket = getSocket();

  useEffect(() => {
    if (role === 'teacher') getStudents(jwt, dispatch);
  }, [jwt, dispatch, role]);

  const users = role === 'teacher' ? students : [me];

  const submitHandler = async event => {
    event.preventDefault();
    const {
      target: { elements },
    } = event;
    Array.from(document.querySelectorAll(`.${styles['err-message']}`)).forEach(
      input => {
        input.remove();
      }
    );
    const inputs = Array.from(elements).filter(
      input => input.type !== 'submit'
    );

    const [titleInput] = inputs.filter(input => input.name === 'title');
    const [performerInput] = inputs.filter(input => input.name === 'performer');

    const { value: title } = titleInput;
    const { value: performer } = performerInput;

    const titleInvalid = title === '';
    const perfomerInvalid = performer === '';

    titleInput.classList[titleInvalid ? 'add' : 'remove'](
      styles['form__input--invalid']
    );
    performerInput
      .closest(`.${styles['form__input']}`)
      .classList[perfomerInvalid ? 'add' : 'remove'](
        styles['form__input--invalid']
      );

    if (titleInvalid || perfomerInvalid) {
      if (titleInvalid)
        titleInput.insertAdjacentHTML(
          'afterend',
          `<p class=${styles['err-message']}>Please provide a valid name</p>`
        );
      if (perfomerInvalid)
        performerInput
          .closest(`.${styles['form__input']}`)
          .insertAdjacentHTML(
            'afterend',
            `<p class=${styles['err-message']}>Please choose an executor of the task</p>`
          );
      return;
    }

    titleInput.value = '';

    const [valid, authorized, task] =
      role === 'student'
        ? await createTask(jwt, { title }, dispatch)
        : await createSupervisedStudentTask(
            jwt,
            performer,
            { title },
            dispatch
          );

    if (!authorized) {
      logout(dispatch);
      return;
    }

    if (valid) {
      socket.emit('create_task', { creator: username, supervisor, task });
      notifyTask(task, username, dispatch);
    }
  };

  return (
    <form className={styles.form} onSubmit={submitHandler}>
      {' '}
      <div className={styles['form__input-container']}>
        <input
          className={styles['form__input']}
          type="text"
          id="title"
          name="title"
          placeholder="Task name"
        />
      </div>
      <div className={styles['form__input-container']}>
        <Select
          className={styles['form__input']}
          selectTitle="Performer"
          optionTitle="Please choose a performer"
          name="performer"
          users={users}
        />
      </div>
      <Button className={styles['form__submit-btn']} text="Add" type="submit" />
    </form>
  );
};

NewTaskForm.propTypes = {};

export default NewTaskForm;
