import { logout } from '../../../../store/slice/auth';
import {
  acceptDemand,
  cancelDemand,
} from '../../../../store/slice/teaching-demands';
import { generatedDemandCellText, getSocket } from '../../../../utils/utils';
import styles from './Demand.module.scss';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Demand component in the teaching demands page, representing an existing teaching demand displayed in the teaching demand's list
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Demand = props => {
  const {
    users: {
      me: { role },
    },
    auth: { jwt },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const socket = getSocket();

  const { id, rowNumber, username, sent, accepted, cancelled } = props;
  const sentTime = moment(sent).tz('Europe/Zurich');

  const acceptHandler = async () => {
    const [authorized, demand] = await acceptDemand(jwt, id, dispatch);
    if (!authorized) {
      logout(dispatch);
      return;
    }
    socket.emit('accept_teaching_demand', demand);
  };

  const cancelHandler = async () => {
    const [authorized, demand] = await cancelDemand(jwt, id, dispatch);
    if (!authorized) {
      logout(dispatch);
      return;
    }
    socket.emit('cancel_teaching_demand', demand);
  };

  let rowStyles = styles['demand__row'];
  if (accepted) rowStyles += ` ${styles['demand__row--accepted']}`;
  else if (cancelled) rowStyles += ` ${styles['demand__row--cancelled']}`;

  return (
    <tr className={rowStyles}>
      <th scope="row" className={styles['demand__cell']}>
        {rowNumber}
      </th>
      <td className={styles['demand__cell']}>{username}</td>
      <td className={styles['demand__cell']}>
        {sentTime.format('DD.MM.YYYY HH:mm')}
      </td>
      {!accepted && !cancelled && (
        <Fragment>
          <td
            className={`${styles['demand__cell']} ${styles['demand__cell--action']}`}
          >
            {role === 'teacher' ? (
              <FontAwesomeIcon
                icon={faCheck}
                className={`${styles['demand__action']} ${styles['demand__action--accept']}`}
                onClick={acceptHandler}
              />
            ) : (
              'Pending...'
            )}
          </td>
          <td
            className={`${styles['demand__cell']} ${styles['demand__cell--action']}`}
          >
            {role === 'teacher' ? (
              <FontAwesomeIcon
                icon={faXmark}
                className={`${styles['demand__action']} ${styles['demand__action--cancel']}`}
                onClick={cancelHandler}
              />
            ) : (
              'Pending...'
            )}
          </td>
        </Fragment>
      )}
      {(accepted || cancelled) && (
        <Fragment>
          <td
            className={`${styles['demand__cell']} ${styles['demand__cell--action']}`}
          >
            {generatedDemandCellText(accepted)}
          </td>
          <td
            className={`${styles['demand__cell']} ${styles['demand__cell--action']}`}
          >
            {generatedDemandCellText(cancelled)}
          </td>
        </Fragment>
      )}
    </tr>
  );
};

Demand.propTypes = {
  /** the id of the teaching demand */
  id: PropTypes.string,
  /** the row number of the teaching demand in the teaching demand's list */
  rowNumber: PropTypes.number,
  /** the username of the other user involved in the teaching demand  */
  username: PropTypes.string,
  /** the sent time of the teaching demand */
  sent: PropTypes.string,
  /** the acceptation status of the teaching demand */
  accepted: PropTypes.bool,
  /** the cancellation status of the teaching demand */
  cancelled: PropTypes.bool,
};

export default Demand;
