import { logout } from '../../../store/slice/auth';
import { getEvents } from '../../../utils/api';
import { isGuest } from '../../../utils/utils';
import Button from '../../UI/Button/Button';
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import Event from './Event/Event';
import styles from './Events.module.scss';
import { useAsync } from 'react-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

/**
 * Events component in the Dashboard page, representing the list of recent events displayed in the page
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Events = () => {
  const dispatch = useDispatch();
  const {
    auth: { jwt },
    users: {
      me: { _id },
    },
  } = useSelector(state => state);
  const { data, error, isPending } = useAsync({
    promiseFn: getEvents,
    token: jwt,
    page: 1,
    limit: 3,
  });

  if (data && !data.authorized) logout(dispatch);

  return (
    <div className={styles.events}>
      <h2 className={styles['events__title']}>Events</h2>
      <div className={styles['events__list']}>
        {isPending && <LoadingSpinner style={{ gridColumn: '1 / 3' }} />}
        {(error || !data?.valid) && <h3>Something went wrong.</h3>}
        {data?.valid &&
          data.events.map(event => (
            <Event
              key={event._id}
              title={event.title}
              description={event.description}
              datetime={event.beginning}
              guest={isGuest(_id, event.guests)}
            />
          ))}
      </div>
      <Link className={styles['events__link']} to="/calendar">
        <Button
          className={styles['events__link-btn']}
          type="button"
          text="View calendar"
        />
      </Link>
    </div>
  );
};

Events.propTypes = {};

export default Events;
