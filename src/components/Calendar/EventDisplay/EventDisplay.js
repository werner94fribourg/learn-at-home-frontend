import { logout } from '../../../store/slice/auth';
import { setPeriod, setSelectedDate } from '../../../store/slice/calendar';
import {
  displayCalendarHeaderPeriod,
  setActivePeriod,
} from '../../../utils/utils';
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import Calendar from './Calendar/Calendar';
import styles from './EventDisplay.module.scss';
import EventList from './EventList/EventList';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';

/**
 * EventDisplay component in the Calendar page, representing the display of the week, month or yearly events
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const EventDisplay = () => {
  const {
    auth: { jwt },
    calendar: { selectedDate, period, loading },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const formattedDate = moment(selectedDate).tz('Europe/Zurich');

  const now = moment(Date.now()).tz('Europe/Zurich');

  const leftNavigationHandler = async () => {
    const authorized = await setSelectedDate(
      jwt,
      formattedDate.clone().subtract(1, period).valueOf(),
      period,
      dispatch
    );
    if (!authorized) logout(dispatch);
  };

  const rightNavigationHandler = async () => {
    const authorized = await setSelectedDate(
      jwt,
      formattedDate.clone().add(1, period).valueOf(),
      period,
      dispatch
    );
    if (!authorized) logout(dispatch);
  };

  const periodHandler = period => {
    setPeriod(jwt, period, selectedDate, dispatch);
  };

  const periodClassName = styles['event-display__period'];

  const activePeriodClassName = styles['event-display__period--active'];

  return (
    <div className={styles['event-display']}>
      <div className={styles['event-display__header']}>
        <div className={styles['event-display__navigations']}>
          <FontAwesomeIcon
            className={styles['event-display__navigation']}
            icon={faChevronLeft}
            onClick={leftNavigationHandler}
          />
          <span className={styles['event-display__value']}>
            {displayCalendarHeaderPeriod(period, now, formattedDate)}
          </span>
          <FontAwesomeIcon
            className={styles['event-display__navigation']}
            icon={faChevronRight}
            onClick={rightNavigationHandler}
          />
        </div>
        <div className={styles['event-display__period-selector']}>
          <span
            className={setActivePeriod(
              period === 'week',
              periodClassName,
              activePeriodClassName
            )}
            onClick={periodHandler.bind(null, 'week')}
          >
            Week
          </span>
          <span
            className={setActivePeriod(
              period === 'month',
              periodClassName,
              activePeriodClassName
            )}
            onClick={periodHandler.bind(null, 'month')}
          >
            Month
          </span>
          <span
            className={setActivePeriod(
              period === 'year',
              periodClassName,
              activePeriodClassName
            )}
            onClick={periodHandler.bind(null, 'year')}
          >
            Year
          </span>
        </div>
      </div>
      {loading && <LoadingSpinner />}
      {!loading && period === 'week' && <Calendar />}
      {!loading && period !== 'week' && <EventList />}
    </div>
  );
};

EventDisplay.propTypes = {};

export default EventDisplay;
