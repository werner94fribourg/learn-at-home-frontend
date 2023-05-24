import { logout } from '../../../../store/slice/auth';
import {
  createEvent,
  deleteEvent,
  eventModified,
  modifyEvent,
} from '../../../../store/slice/calendar';
import { formReducers, getSocket } from '../../../../utils/utils';
import Button from '../../../UI/Button/Button';
import DataList from './DataList/DataList';
import styles from './Form.module.scss';
import Input from './Input/Input';
import { faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

/**
 * Form component in the EventForm, representing the displayed form to create / modify an event
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Form = props => {
  const {
    auth: { jwt },
    users: {
      me: { username },
    },
  } = useSelector(state => state);
  const { onClose, event, isNew } = props;
  const [typedEvent, dispatchForm] = useReducer(formReducers, event);
  const formRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState(false);
  const [userListDisplayed, setUserListDisplayed] = useState(false);
  const dispatch = useDispatch();
  const [errMessage, setErrorMessage] = useState(null);
  const socket = getSocket();
  let headerText = `${isNew ? 'New' : 'Modify'} Event`;
  let btnText = isNew ? 'Create Event' : 'Modify';
  const initialBeginning = moment(event?.beginning).tz('Europe/Zurich');
  const initialEnd = moment(event?.end).tz('Europe/Zurich');

  let descriptionText = isNew
    ? 'Create a new event and invite your participants'
    : 'Modify an existing event';

  useEffect(() => {
    if (!visible && !displayed) {
      setVisible(true);
      setDisplayed(true);
    }
  }, [visible, displayed]);

  useEffect(() => {
    dispatchForm({ type: 'init' });
  }, []);

  const closeHandler = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 510);
  };

  const formClickHandler = event => {
    event.stopPropagation();
    setUserListDisplayed(false);
  };

  const submitHandler = async event => {
    event.preventDefault();

    const { beginningDate, endDate, beginningTime, endTime } = typedEvent;

    const beginning = moment(`${beginningDate} ${beginningTime}`).tz(
      'Europe/Zurich'
    );
    const end = moment(`${endDate} ${endTime}`).tz('Europe/Zurich');

    if (beginning.valueOf() > end.valueOf()) {
      setErrorMessage("The start of the event can't be before the end of it.");
      typedEvent.beginningDate = '';
      typedEvent.endDate = '';
      typedEvent.beginningTime = '';
      typedEvent.endTime = '';
      return;
    }

    const calledFct = isNew ? createEvent : modifyEvent;
    const emittedEvent = isNew ? 'event_created' : 'modify_event';

    const [valid, authorized, returnedEvent] = await calledFct(
      jwt,
      username,
      typedEvent,
      dispatch
    );

    if (!authorized) {
      logout(dispatch);
      return;
    }

    const newBeginning = moment(returnedEvent.beginning).tz('Europe/Zurich');
    const newEnd = moment(returnedEvent.end).tz('Europe/Zurich');
    if (valid) {
      onClose();
      if (isNew) {
        socket.emit(emittedEvent, returnedEvent);
        return;
      } else
        socket.emit(emittedEvent, {
          initialBeginning: initialBeginning.valueOf(),
          initialEnd: initialEnd.valueOf(),
          username,
          event: returnedEvent,
        });
      if (
        initialBeginning.valueOf() !== newBeginning.valueOf() ||
        initialEnd.valueOf() !== newEnd.valueOf()
      )
        eventModified(returnedEvent, username, dispatch);
    }
  };

  const deleteHandler = async () => {
    const [valid, authorized] = await deleteEvent(
      jwt,
      event,
      username,
      dispatch
    );

    if (!authorized) {
      logout(dispatch);
      return;
    }

    if (valid) socket.emit('delete_event', { username, event });

    onClose();
  };

  const changeHandler = (type, event) => {
    dispatchForm({ type, payload: event.target.value });
  };

  const setUserListStatusHandler = event => {
    event.stopPropagation();
    setUserListDisplayed(prevState => !prevState);
  };

  const hideUserListHandler = () => {
    setUserListDisplayed(false);
  };

  const skipChangeHandler = () => {};

  const removeUserHandler = event => {
    const {
      code,
      target: { value: users },
    } = event;

    if (users.length === 0) return;

    if (code !== 'Backspace' && code !== 'Delete') return;

    const lastUser = users.split(' ').pop();

    dispatchForm({ type: 'remove_participant', payload: lastUser });
  };

  const pickUserHandler = user => {
    if (user) dispatchForm({ type: 'participants', payload: user });

    hideUserListHandler();
  };

  let participantsClassNames = styles['form__input'];

  if (typedEvent?.participants && typedEvent.participants.length > 0)
    participantsClassNames += ` ${styles['form__input--participants']}`;

  return (
    <CSSTransition
      nodeRef={formRef}
      timeout={500}
      in={visible}
      classNames={{
        enter: styles['form__background-enter'],
        enterActive: styles['form__background-enter-active'],
        enterDone: styles['form__background-enter-done'],
        exit: styles['form__background-exit'],
        exitActive: styles['form__background-exit-active'],
        exitDone: styles['form__background-exit-done'],
      }}
      mountOnEnter
      unmountOnExit
    >
      <div
        className={styles['form__background']}
        ref={formRef}
        onClick={closeHandler}
      >
        <div className={styles.form} onClick={formClickHandler}>
          <div className={styles['form__header']}>
            <h2 className={styles['form__title']}>{headerText}</h2>
            <p className={styles['form__description']}>{descriptionText}</p>
            {errMessage && (
              <p className={styles['form__error']}>{errMessage}</p>
            )}
          </div>
          <form className={styles['form__form']} onSubmit={submitHandler}>
            <Input
              className={styles['form__input']}
              title="Title"
              id="title"
              type="text"
              placeholder="Type the name of your event"
              required={true}
              value={typedEvent?.title || ''}
              onChange={changeHandler.bind(null, 'title')}
            />
            <Input
              className={styles['form__input']}
              title="Description"
              id="description"
              type="textarea"
              placeholder="Describe your event"
              required={true}
              rows="4"
              value={typedEvent?.description || ''}
              onChange={changeHandler.bind(null, 'description')}
            />
            <div className={styles['form__participants-container']}>
              <Input
                className={participantsClassNames}
                title="Participants"
                id="participants"
                type="text"
                placeholder="Add some participants"
                value={
                  typedEvent?.participants
                    ?.map(user => user.username)
                    ?.join(' ') || ''
                }
                onChange={skipChangeHandler}
                onKeyDown={removeUserHandler}
                required={false}
              >
                <FontAwesomeIcon
                  className={styles['form__input-icon']}
                  icon={faUserPlus}
                  onClick={setUserListStatusHandler}
                />
              </Input>
              {userListDisplayed && <DataList onChange={pickUserHandler} />}
            </div>
            <div className={styles['form__period-selectors']}>
              <Input
                className={`${styles['form__input']} ${styles['form__input--date']}`}
                title="Start date"
                id="beginningDate"
                type="date"
                required={true}
                value={typedEvent?.beginningDate || ''}
                onChange={changeHandler.bind(null, 'beginningDate')}
              />
              <Input
                className={`${styles['form__input']} ${styles['form__input--date']}`}
                title="End date"
                id="endDate"
                type="date"
                required={true}
                value={typedEvent?.endDate || ''}
                onChange={changeHandler.bind(null, 'endDate')}
              />
              <Input
                className={styles['form__input']}
                title="Start time"
                id="beginningTime"
                type="time"
                required={true}
                value={typedEvent?.beginningTime || ''}
                onChange={changeHandler.bind(null, 'beginningTime')}
              />
              <Input
                className={styles['form__input']}
                title="End time"
                id="endTime"
                type="time"
                required={true}
                value={typedEvent?.endTime || ''}
                onChange={changeHandler.bind(null, 'endTime')}
              />
            </div>
            <div className={styles['form__btns-container']}>
              {!isNew && (
                <Button
                  className={`${styles['form__submit-btn']} ${styles['form__submit-btn--delete']}`}
                  type="button"
                  text="Delete"
                  onClick={deleteHandler}
                />
              )}
              <Button
                className={styles['form__submit-btn']}
                type="submit"
                text={btnText}
              />
            </div>
          </form>
          <FontAwesomeIcon
            className={styles['form__close-btn']}
            icon={faXmark}
            onClick={closeHandler}
          />
        </div>
      </div>
    </CSSTransition>
  );
};

Form.propTypes = {
  /** the handler function when the user closes the form */
  onClose: PropTypes.func,
  /** a boolean informing the user if we are creating a new event or not */
  isNew: PropTypes.bool,
  /** in the case where we are not creating a new event, the event that we are modifying in the form */
  event: PropTypes.object,
};

export default Form;
