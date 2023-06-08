import { getWeekDays, getWeekTimes } from '../../../../utils/utils';
import CalendarHeader from '../CalendarHeader/CalendarHeader';
import CalendarRow from '../CalendarRow/CalendarRow';
import CalendarTimeRow from '../CalendarTimeRow/CalendarTimeRow';
import styles from './Calendar.module.scss';
import moment from 'moment-timezone';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';

/**
 * Calendar component in the Calendar page, representing a week planning containing the displayed week events
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Calendar = () => {
  const { selectedDate } = useSelector(state => state.calendar);

  const now = moment(Date.now()).tz('Europe/Zurich');
  const formattedDate = moment(selectedDate).tz('Europe/Zurich');

  const weekDays = getWeekDays(formattedDate);

  const hours = getWeekTimes(weekDays);

  return (
    <table className={styles.calendar} cellSpacing={0}>
      <thead>
        <tr>
          <th className={styles['calendar__top-corner']}></th>
          {weekDays.map(day => (
            <CalendarHeader
              key={day.valueOf()}
              date={day}
              active={day.isSame(now, 'day')}
            />
          ))}
        </tr>
      </thead>
      <tbody className={styles['calendar__table-content']}>
        {hours.map((line, index) => {
          const [firstTime] = line;

          const quarterTimes = new Array(4)
            .fill(0)
            .map((_, index) =>
              line.map(time => time.clone().add(index * 15, 'minutes'))
            );
          const firstQuarter = quarterTimes.shift();

          return (
            <Fragment key={index}>
              <CalendarTimeRow
                time={firstTime.format('HH:mm')}
                times={firstQuarter}
                now={now}
              />
              {quarterTimes.map(line => (
                <CalendarRow key={line[0].valueOf()} times={line} now={now} />
              ))}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

Calendar.propTypes = {};

export default Calendar;
