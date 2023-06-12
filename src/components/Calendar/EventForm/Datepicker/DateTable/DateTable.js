import { WEEK_DAYS } from '../../../../../utils/globals';
import {
  generateDays,
  isSameMonth,
  isSameDay,
} from '../../../../../utils/utils';
import DateItem from '../DateItem/DateItem';
import styles from './DateTable.module.scss';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

/**
 * DateTable component in the DatePicker, representing the list of dates for the current displayed month
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const DateTable = props => {
  const { date, displayed, onDateClick } = props;
  const now = moment(Date.now()).tz('Europe/Zurich');

  const dates = generateDays(displayed);

  return (
    <table className={styles.datetable}>
      <thead>
        <tr className={styles['datetable__header']}>
          {WEEK_DAYS.map(day => (
            <th key={day}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dates.map((line, index) => (
          <tr key={index}>
            {line.map(entry => (
              <DateItem
                key={entry}
                date={entry}
                isMonth={isSameMonth(displayed, entry)}
                isToday={isSameDay(now, entry)}
                isSelected={isSameDay(date, entry)}
                onClick={onDateClick.bind(null, entry)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

DateTable.propTypes = {
  /** the selected date in the application */
  date: PropTypes.object,
  /** the date that is actually displayed in the table */
  displayed: PropTypes.object,
  /** the handler function called when the user clicks on a specific date */
  onDateClick: PropTypes.func,
};

export default DateTable;
