import styles from './Event.module.scss';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

/**
 * Event component in the Dashboard page, representing an event displayed in the list of events
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Event = props => {
  const { title, description, datetime, guest } = props;

  const formattedDateTime = moment(datetime)
    .tz('Europe/Zurich')
    .format('HH:mm, dd, DD.MM.YYYY');

  let eventClassNames = styles.event;

  if (guest) eventClassNames += ` ${styles['event--guest']}`;

  return (
    <div className={eventClassNames}>
      <h3 className={styles['event__title']}>{title}</h3>
      <p className={styles['event__paragraph']}>{description}</p>
      <span className={styles['event__datetime']}>
        {formattedDateTime.toUpperCase()}
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
  datetime: PropTypes.string,
  /** the guest status of the connected user regarding the event */
  guest: PropTypes.bool,
};

export default Event;
