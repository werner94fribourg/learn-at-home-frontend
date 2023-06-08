import styles from './CalendarHeader.module.scss';
import PropTypes from 'prop-types';

/**
 * CalendarHeader component in the Calendar page, used to display a header cell in the Calendar component
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const CalendarHeader = props => {
  const { date, active } = props;

  let dayClassNames = styles['header__weekday'];

  if (active) dayClassNames += ` ${styles.active}`;

  return (
    <th className={styles.header}>
      <div className={styles['header__infos']}>
        <span className={styles['header__day']}>{date.format('ddd')}</span>
        <span className={dayClassNames}>{date.format('DD')}</span>
      </div>
    </th>
  );
};

CalendarHeader.propTypes = {
  /** the date associated with the header cell */
  date: PropTypes.object,
  /** a boolean telling if the associated date corresponds to the actual system date */
  active: PropTypes.bool,
};

export default CalendarHeader;
