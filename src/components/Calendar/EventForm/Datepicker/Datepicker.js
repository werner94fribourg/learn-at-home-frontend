import { logout } from '../../../../store/slice/auth';
import { setSelectedDate } from '../../../../store/slice/calendar';
import DateTable from './DateTable/DateTable';
import styles from './Datepicker.module.scss';
import {
  faChevronLeft,
  faChevronRight,
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * DatePicker component in the EventForm, representing the month datepicker we can click to modify the selected date
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const DatePicker = () => {
  const {
    auth: { jwt },
    calendar: { selectedDate, period },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const [displayed, setDisplayed] = useState(Date.now());
  const [initialized, setInitialized] = useState(false);
  const selectedDateMomentObject = moment(selectedDate).tz('Europe/Zurich');
  const displayedMomentObject = moment(displayed).tz('Europe/Zurich');
  const firstDayOfMonth = displayedMomentObject.clone().startOf('month');

  const cellHandler = async date => {
    const authorized = await setSelectedDate(
      jwt,
      date.valueOf(),
      period,
      dispatch
    );
    if (!authorized) logout(dispatch);
    setDisplayed(date.valueOf());
  };

  const homeHandler = () => {
    setDisplayed(selectedDate);
  };

  const leftNavigationHandler = () => {
    const firstDayOfPreviousMonth = firstDayOfMonth
      .clone()
      .subtract(1, 'month');
    setDisplayed(firstDayOfPreviousMonth.valueOf());
  };

  const rightNavigationHandler = () => {
    const firstDayOfNextMonth = firstDayOfMonth.clone().add(1, 'month');
    setDisplayed(firstDayOfNextMonth.valueOf());
  };

  useEffect(() => {
    const setDate = async () => {
      const authorized = await setSelectedDate(
        jwt,
        Date.now(),
        period,
        dispatch
      );
      if (!authorized) logout(dispatch);
    };
    if (!initialized) {
      setDate();
      setInitialized(true);
    }
  }, [jwt, dispatch, initialized, period, setInitialized]);

  return (
    <div className={styles.datepicker}>
      <div className={styles['datepicker__header']}>
        <h2 className={styles['datepicker__title']}>
          {displayedMomentObject.format('MMMM YYYY')}
        </h2>
        <div className={styles['datepicker__navigations']}>
          <FontAwesomeIcon
            className={styles['datepicker__navigation']}
            icon={faHome}
            onClick={homeHandler}
          />
          <FontAwesomeIcon
            className={styles['datepicker__navigation']}
            icon={faChevronLeft}
            onClick={leftNavigationHandler}
          />
          <FontAwesomeIcon
            className={styles['datepicker__navigation']}
            icon={faChevronRight}
            onClick={rightNavigationHandler}
          />
        </div>
      </div>
      <DateTable
        date={selectedDateMomentObject}
        displayed={displayedMomentObject}
        onDateClick={cellHandler}
      />
    </div>
  );
};

DatePicker.propTypes = {};

export default DatePicker;
