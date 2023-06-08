import EventDisplay from '../components/Calendar/EventDisplay/EventDisplay';
import EventForm from '../components/Calendar/EventForm/EventForm';
import styles from './Calendar.module.scss';

/**
 * Component representing the Calendar page of the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Calendar = () => {
  return (
    <div className={styles.calendar}>
      <EventForm />
      <EventDisplay />
    </div>
  );
};

Calendar.propTypes = {};

export default Calendar;
