import styles from './Input.module.scss';
import PropTypes from 'prop-types';

/**
 * Input component in the Home page, representing an input field the user needs to fulfill to connect into the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Input = props => {
  const { title, id, type, placeholder, className, children, inputRef } = props;

  return (
    <div className={className}>
      <label className={styles['form__input-label']} htmlFor={id}>
        {title}
      </label>
      <input
        className={styles['form__input-input']}
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        ref={inputRef}
        required
      />
      {children}
    </div>
  );
};

Input.propTypes = {
  /** The label title of the input */
  title: PropTypes.string,
  /** The id of the input */
  id: PropTypes.string,
  /** The text displayed as a placeholder of the input */
  placeholder: PropTypes.string,
  /** The class(es) we want to associate with the input */
  className: PropTypes.string,
  /** The hook referencing the input */
  inputRef: PropTypes.object,
};

export default Input;
