import styles from './Event.module.scss';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

/**
 * Event component in the EventList component, used to display an event within the list
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Event = props => {
  const { title, description, beginning, end, guest, onClick } = props;

  const formattedBeginning = moment(beginning)
    .tz('Europe/Zurich')
    .format('ddd, DD.MM.YYYY HH:mm');
  const formattedEnd = moment(end)
    .tz('Europe/Zurich')
    .format('ddd, DD.MM.YYYY HH:mm');

  let eventClassNames = styles.event;

  if (guest) eventClassNames += ` ${styles['event--guest']}`;

  return (
    <div className={eventClassNames} onClick={onClick}>
      <h3 className={styles['event__title']}>{title}</h3>
      <p className={styles['event__paragraph']}>{description}</p>
      <span
        className={`${styles['event__time']} ${styles['event__time--start']}`}
      >
        <span>Start: </span>
        <span>{formattedBeginning.toUpperCase()}</span>
      </span>
      <span
        className={`${styles['event__time']} ${styles['event__time--end']}`}
      >
        <span>End: &nbsp;&nbsp;</span>
        <span>{formattedEnd.toUpperCase()}</span>
      </span>
    </div>
  );
};

Event.propTypes = {
  /** the title of the event */
  title: PropTypes.string,
  /** the description of the event */
  description: PropTypes.string,
  /** the beginning time of the event */
  beginning: PropTypes.string,
  /** the end time of the event */
  end: PropTypes.string,
  /** a boolean informing if the connected user is a guest of the event */
  guest: PropTypes.bool,
  /** the handler function called when the user clicks on the event */
  onClick: PropTypes.func,
};
export default Event;
