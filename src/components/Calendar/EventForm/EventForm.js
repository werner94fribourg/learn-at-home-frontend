import Button from '../../UI/Button/Button';
import DatePicker from './Datepicker/Datepicker';
import styles from './EventForm.module.scss';
import Form from './Form/Form';
import { useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * EventForm component in the Calendar page, representing the datepicker, the creation form button and the form itself
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const EventForm = () => {
  const [formVisible, setFormVisible] = useState(false);

  const closeHandler = () => {
    setFormVisible(false);
  };
  const btnHandler = () => {
    setFormVisible(true);
  };

  return (
    <div className={styles['event-form']}>
      <h1 className={styles['event-form__title']}>Calendar</h1>
      <div className={styles['event-form__calendar-container']}>
        <Button
          className={styles['event-form__event-btn']}
          type="button"
          text="New event +"
          onClick={btnHandler}
        />
        <DatePicker />
      </div>
      {formVisible &&
        createPortal(
          <Form onClose={closeHandler} isNew={true} />,
          document.querySelector('#root')
        )}
    </div>
  );
};

EventForm.propTypes = {};

export default EventForm;
