import styles from './Input.module.scss';
import PropTypes from 'prop-types';

/**
 * Input component in the ProfilePage, representing an input field in the forms
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Input = props => {
  const {
    title,
    id,
    type,
    value,
    required,
    inputRef,
    onChange,
    photo,
    children,
    accept,
    placeholder,
  } = props;

  let className = styles.input;

  if (photo) className += ` ${styles['input--photo']}`;

  return (
    <div className={className}>
      {photo && children}
      {!photo && (
        <label className={styles['input__label']} htmlFor={id}>
          {title}
        </label>
      )}
      <input
        className={styles['input__input']}
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        accept={accept}
        ref={inputRef}
      />
      {photo && (
        <label className={styles['input__label--btn']} htmlFor={id}>
          {title}
        </label>
      )}
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
  /** the value of the input field */
  value: PropTypes.string,
  /** a boolean informing if the input field is required or note */
  required: PropTypes.bool,
  /** The hook referencing the input */
  inputRef: PropTypes.object,
  /** the handler function when the value of the input changes */
  onChange: PropTypes.func,
  /** a boolean informing the connected user if the input represents a photo upload input */
  photo: PropTypes.bool,
  /** the child component accepted by the Input one */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  /** the type of data accepted by the input in case of a file type */
  accept: PropTypes.string,
  /** the placeholder displayed in the input */
  placeholder: PropTypes.string,
};

export default Input;
