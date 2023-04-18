import styles from './Button.module.scss';
import PropTypes from 'prop-types';

/**
 * Component representing a clickable button in the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Button = props => {
  const { className, type, text } = props;
  return (
    <button className={`${styles.button} ${className}`} type={type}>
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
  text: PropTypes.string,
};

export default Button;
