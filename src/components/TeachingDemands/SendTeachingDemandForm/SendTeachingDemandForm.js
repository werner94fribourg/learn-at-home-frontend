import { logout } from '../../../store/slice/auth';
import {
  getTeachers,
  resetMessage,
  sendDemand,
  setErrorMessage,
  setSuccessMessage,
} from '../../../store/slice/teaching-demands';
import { getSocket } from '../../../utils/utils';
import Alert from '../../UI/Alert/Alert';
import Button from '../../UI/Button/Button';
import Select from '../../UI/Select/Select';
import styles from './SendTeachingDemandForm.module.scss';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

/**
 * SendTeachindDemand component in the the teaching demands page, representing the form used to send a new teaching demand to a teacher
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const SendTeachingDemandForm = () => {
  const {
    auth: { jwt },
    demands: {
      teachers,
      sendMessage: { type, message },
    },
  } = useSelector(state => state);
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const socket = getSocket();

  const editBtnHandler = () => {
    setEdit(true);
  };

  const cancelBtnHandler = () => {
    setEdit(false);
  };

  const sendDemandHandler = async event => {
    event.preventDefault();
    const {
      target: { elements },
    } = event;

    const [teacher] = Array.from(elements).filter(
      input => input.name === 'teacher'
    );
    if (!teacher.value) {
      setErrorMessage('Please choose a teacher.', dispatch);
      return;
    }

    const [valid, authorized, message, demand] = await sendDemand(
      jwt,
      teacher.value,
      dispatch
    );

    if (!authorized) {
      logout(dispatch);
      return;
    }

    if (!valid) {
      setErrorMessage(message, dispatch);
      return;
    } else {
      setSuccessMessage(
        'Teaching request successfully sent to the teacher.',
        dispatch
      );
      setEdit(false);
      socket.emit('send_teaching_demand', demand);
    }
  };

  const alertHandler = () => {
    resetMessage(dispatch);
  };

  useEffect(() => {
    const getAvailableTeachers = async () => {
      const authorized = await getTeachers(jwt, dispatch);
      if (!authorized) logout(dispatch);
    };
    getAvailableTeachers();
  }, [jwt, dispatch]);

  return (
    <div className={styles.form}>
      {!edit && (
        <Button
          className={styles['form__btn']}
          text="New Demand"
          type="button"
          onClick={editBtnHandler}
        />
      )}
      {edit && (
        <form onSubmit={sendDemandHandler}>
          <Select
            className={styles['form__select']}
            selectTitle="Teacher"
            optionTitle="Please choose a teacher"
            name="teacher"
            users={teachers}
          />
          <div className={styles['form__actions']}>
            <Button className={styles['form__btn']} text="Send" type="submit" />
            <Button
              className={`${styles['form__btn']} ${styles['form__btn--cancel']}`}
              text="Cancel"
              type="button"
              onClick={cancelBtnHandler}
            />
          </div>
        </form>
      )}
      {message &&
        createPortal(
          <Alert message={message} type={type} onClose={alertHandler} />,
          document.querySelector('#root')
        )}
    </div>
  );
};

SendTeachingDemandForm.propTypes = {};

export default SendTeachingDemandForm;
