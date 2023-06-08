import { displayEventNotification } from '../../../../store/slice/calendar';
import { getSingleEvent } from '../../../../utils/api';
import { isGuest, isOrganizer } from '../../../../utils/utils';
import Form from '../../EventForm/Form/Form';
import Event from './Event/Event';
import styles from './EventList.module.scss';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

/**
 * EventList component in the Calendar page, used to display a list of occuring events during a certain period (month or year)
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const EventList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [choosenEvent, setChoosenEvent] = useState(undefined);
  const {
    calendar: { events },
    users: {
      me: { _id },
    },
    auth: { jwt },
  } = useSelector(state => state);
  const dispatch = useDispatch();

  const clickEventHandler = async event => {
    if (isGuest(_id, event.guests)) {
      displayEventNotification(event, dispatch);
      return;
    }
    if (isGuest(_id, event.attendees)) {
      displayEventNotification(event, dispatch, true);
      return;
    }

    const organizer = event.organizer?._id || event.organizer;
    if (!isOrganizer(_id, organizer)) return;

    const { event: detailedEvent } = await getSingleEvent(jwt, event._id);

    setChoosenEvent(detailedEvent);
    setFormVisible(true);
  };

  const closeHandler = () => {
    setChoosenEvent(undefined);
    setFormVisible(false);
  };

  return (
    <div className={styles['event-list']}>
      {events.map(event => (
        <Event
          key={event._id}
          title={event.title}
          description={event.description}
          beginning={event.beginning}
          end={event.end}
          guest={isGuest(_id, event.guests)}
          onClick={clickEventHandler.bind(null, event)}
        />
      ))}
      {formVisible &&
        choosenEvent &&
        createPortal(
          <Form onClose={closeHandler} isNew={false} event={choosenEvent} />,
          document.querySelector('#root')
        )}
    </div>
  );
};

export default EventList;
