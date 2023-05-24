import styles from './Event.module.scss';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

/**
 * Event component in the Cell component, used to display an event within the time cells
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Event = props => {
  const { title, beginning, end, guest, onClick } = props;

  const formattedBeginning = moment(beginning).tz('Europe/Zurich');
  const formattedEnd = moment(end).tz('Europe/Zurich');

  const endOfDay = formattedBeginning.clone().endOf('day');

  const duration = formattedEnd.diff(formattedBeginning, 'minutes');
  const endOfDayDuration = endOfDay.diff(formattedBeginning, 'minutes');

  const height = Math.round((duration * 15) / 60);

  const endOfDayHeight = Math.round((endOfDayDuration * 15) / 60);

  let eventClassNames = styles.event;

  if (guest) eventClassNames += ` ${styles['event--guest']}`;

  return (
    <div
      style={{
        height: `${height > endOfDayHeight ? endOfDayHeight : height}rem`,
      }}
      className={eventClassNames}
      data-duration={duration}
      onClick={onClick}
    >
      <div>
        <span className={styles['event__title']}>{title}</span>
        <span className={styles['event__time']}>
          {formattedBeginning.format('HH:mm')}
        </span>
      </div>
    </div>
  );
};

Event.propTypes = {
  /** the title of the event */
  title: PropTypes.string,
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
