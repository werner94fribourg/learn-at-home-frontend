import styles from './Input.module.scss';
import PropTypes from 'prop-types';

/**
 * Input component in the Form component, representing an input field in the event form
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Input = props => {
  const {
    title,
    id,
    type,
    placeholder,
    className,
    children,
    rows,
    required,
    value,
    onChange,
    onKeyDown,
  } = props;

  return (
    <div className={className}>
      <label className={styles['input__label']} htmlFor={id}>
        {title}
      </label>
      {type !== 'textarea' && type !== 'userlist' && (
        <input
          className={styles['input__input']}
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      )}
      {type === 'textarea' && (
        <textarea
          className={styles['input__input']}
          id={id}
          name={id}
          placeholder={placeholder}
          required={required}
          rows={rows}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        ></textarea>
      )}
      {children}
    </div>
  );
};

Input.propTypes = {
  /** the label title of the input */
  title: PropTypes.string,
  /** the id and the name of the input field */
  id: PropTypes.string,
  /** the type of the input (text, date, ...) */
  type: PropTypes.string,
  /** the placeholder displayed in the input */
  placeholder: PropTypes.string,
  /** the classes associated with the component */
  className: PropTypes.string,
  /** the child component accepted by the Input one */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  /** in the case of a textarea, the number of rows displayed */
  rows: PropTypes.string,
  /** a boolean informing if the input field is required or note */
  required: PropTypes.bool,
  /** the value of the input field */
  value: PropTypes.string,
  /** the handler function when the value of the input changes */
  onChange: PropTypes.func,
  /** the handler function when the keydown event happens on the input */
  onKeyDown: PropTypes.func,
};

export default Input;
