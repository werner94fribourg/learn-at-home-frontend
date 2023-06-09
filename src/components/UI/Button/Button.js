import styles from './Button.module.scss';
import PropTypes from 'prop-types';

/**
 * Component representing a clickable button in the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Button = props => {
  const { className, type, text, onClick, disabled } = props;
  return (
    <button
      className={`${styles.button} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  /** The class(es) we want to associate with the button */
  className: PropTypes.string,
  /** The type of the button we want to display */
  type: PropTypes.oneOf(['button', 'submit']),
  /** The text we want to display inside the button */
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** the click handler of the button */
  onClick: PropTypes.func,
  /** the disabled status of the button */
  disabled: PropTypes.bool,
};

export default Button;
