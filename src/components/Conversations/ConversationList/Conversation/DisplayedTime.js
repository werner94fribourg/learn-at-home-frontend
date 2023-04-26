import { generateDisplayedTime } from '../../../../utils/utils';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useState } from 'react';

/**
 * DisplayedTime component in the Conversations page, representing the time when a time was sent in a formatted version
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const DisplayedTime = props => {
  const { className, sent } = props;
  const setTrigger = useState(true)[1];
  const sentTime = moment(sent).tz('Europe/Zurich');

  let [displayedTime, timerTime] = generateDisplayedTime(sentTime);

  // Re-render the displayed time
  if (timerTime !== -1)
    setTimeout(() => {
      setTrigger(prevState => !prevState);
    }, timerTime);

  return <span className={className}>{displayedTime}</span>;
};

DisplayedTime.propTypes = {
  /** The class(es) we want to associate with the DisplayedTime component */
  className: PropTypes.string,
  /** the moment when the message was sent (in ISO format) */
  sent: PropTypes.string,
};

export default DisplayedTime;
