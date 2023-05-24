import styles from './DateItem.module.scss';
import PropTypes from 'prop-types';

/**
 * DateItem component in the DateTable, representing a specific date in the table
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const DateItem = props => {
  const { date, isMonth, isToday, isSelected, onClick } = props;

  let itemClassNames = styles.dateitem;

  if (!isMonth) itemClassNames += ` ${styles['dateitem__other-month']}`;

  if (isToday && !isSelected) itemClassNames += ` ${styles['dateitem__now']}`;

  if (isSelected) itemClassNames += ` ${styles['dateitem__selected']}`;

  return (
    <td className={itemClassNames} onClick={onClick}>
      {date.format('DD')}
    </td>
  );
};

DateItem.propTypes = {
  /** the value of the date displayed in the item */
  date: PropTypes.object,
  /** a boolean informing if the the date is in the same month as the selected one */
  isMonth: PropTypes.bool,
  /** a boolean informing if the the date is today's date */
  isToday: PropTypes.bool,
  /** a boolean informing if the the date is in the selected one */
  isSelected: PropTypes.bool,
  /** the handler function called when the user clicks on the date */
  onClick: PropTypes.func,
};

export default DateItem;
