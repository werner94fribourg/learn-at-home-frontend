import Cell from '../Cell/Cell';
import styles from './CalendarRow.module.scss';
import PropTypes from 'prop-types';

/**
 * CalendarRow component in the Calendar page, used to display the hours data in the Calendar component
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const CalendarRow = props => {
  const { times, now } = props;

  return (
    <tr className={styles.row}>
      {times.map(t => {
        let cellClassNames = styles['row__cell'];
        if (t.isSame(now, 'day')) cellClassNames += ` ${styles.active}`;
        return <Cell key={t.valueOf()} time={t} className={cellClassNames} />;
      })}
    </tr>
  );
};

CalendarRow.propTypes = {
  /** the array of times that will be displayed in the cells */
  times: PropTypes.arrayOf(PropTypes.object),
  /** a moment object storing the actual datetime of the system */
  now: PropTypes.object,
};

export default CalendarRow;
