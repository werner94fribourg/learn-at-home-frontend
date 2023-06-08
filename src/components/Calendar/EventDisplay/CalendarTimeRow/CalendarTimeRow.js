import Cell from '../Cell/Cell';
import styles from './CalendarTimeRow.module.scss';
import PropTypes from 'prop-types';

/**
 * CalendarTimeRow component in the Calendar page, used to display the hour cell and the adjacent hours data in the Calendar component
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const CalendarTimeRow = props => {
  const { time, times, now } = props;

  return (
    <tr className={styles.timerow}>
      <td
        className={`${styles['timerow__cell']} ${styles['timerow__hour']}`}
        rowSpan="4"
      >
        <span className={styles['timerow__hour-content']}>{time}</span>
      </td>
      {times.map(t => {
        let cellClassNames = styles['timerow__cell'];
        if (t.isSame(now, 'day')) cellClassNames += ` ${styles.active}`;
        return <Cell key={t.valueOf()} time={t} className={cellClassNames} />;
      })}
    </tr>
  );
};

CalendarTimeRow.propTypes = {
  /** the displayed time in the time cell */
  time: PropTypes.string,
  /** the array of times that will be displayed in the adjacent cells */
  times: PropTypes.arrayOf(PropTypes.object),
  /** a moment object storing the actual datetime of the system */
  now: PropTypes.object,
};

export default CalendarTimeRow;
