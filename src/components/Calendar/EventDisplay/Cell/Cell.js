import { displayEventNotification } from '../../../../store/slice/calendar';
import { getSingleEvent } from '../../../../utils/api';
import { isGuest, isOrganizer } from '../../../../utils/utils';
import Form from '../../EventForm/Form/Form';
import Event from '../Event/Event';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Cell component in the Calendar page, used to display an datetime cell in the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Cell = props => {
  const { jwt } = useSelector(state => state.auth);
  const [formVisible, setFormVisible] = useState(false);
  const [choosenEvent, setChoosenEvent] = useState(undefined);
  const dispatch = useDispatch();

  const { className, time } = props;
  const {
    calendar: { events },
    users: {
      me: { _id },
    },
  } = useSelector(state => state);
  const timeObject = moment(time).tz('Europe/Zurich');

  const startTimeEvents = events.filter(event => {
    const beginningObject = moment(event.beginning).tz('Europe/Zurich');
    const diff = beginningObject.diff(timeObject, 'minutes');

    return diff <= 7 && diff > -7;
  });

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
    <td className={className}>
      {startTimeEvents.map(event => (
        <Event
          key={event._id}
          title={event.title}
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
    </td>
  );
};

Cell.propTypes = {
  /** the classnames applied to the time cell */
  className: PropTypes.string,
  /** the time associated with the cell */
  time: PropTypes.object,
};

export default Cell;
