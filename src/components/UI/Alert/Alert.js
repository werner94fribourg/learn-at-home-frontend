import styles from './Alert.module.scss';
import PropTypes from 'prop-types';

/**
 * Component representing an alert window that is displayed in the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Alert = props => {
  const { message, type, hide, onClose, style } = props;
  let classNames = styles.alert;
  if (type) classNames += ` ${styles[`alert--${type}`]}`;
  if (hide) classNames += ` ${styles.hide}`;

  return (
    <div className={classNames} style={style}>
      <span className={styles['alert__close-btn']} onClick={onClose}>
        {' '}
        &times;
      </span>
      {message}
    </div>
  );
};

Alert.propTypes = {
  /** The message we want to display in the alert window */
  message: PropTypes.string,
  /** The type of alert we want to display */
  type: PropTypes.oneOf(['success', 'error', 'warning']),
  /** The hidden status of the alert */
  hide: PropTypes.bool,
  /** The handler function that will be called when the user clicks the close button */
  onClose: PropTypes.func,
  /** The custom inline styles we want to associate to the alert */
  style: PropTypes.object,
};

export default Alert;
