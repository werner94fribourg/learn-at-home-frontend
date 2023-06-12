import styles from './Input.module.scss';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

/**
 * Input component in the Home page, representing an input field the user needs to fulfill to connect / register into the application
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
    inputRef,
    options,
    value,
    onChange,
  } = props;

  return (
    <div className={className}>
      <label className={styles['form__input-label']} htmlFor={id}>
        {title}
      </label>
      {type !== 'radio' && (
        <Fragment>
          <input
            className={styles['form__input-input']}
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            ref={inputRef}
            required
            value={value}
            onChange={onChange}
          />
          {children}
        </Fragment>
      )}
      {type === 'radio' && (
        <div className={styles['form__input-options']}>
          {options.map(option => (
            <div
              className={styles['form__input-option-container']}
              key={option.value}
            >
              <input
                className={styles['form__input-option']}
                id={`${id}-${option.value}`}
                name={id}
                type={type}
                value={option.value}
                placeholder={placeholder}
                ref={inputRef}
                required
                checked={option.value === value}
                onChange={onChange}
              />
              {option.name}
            </div>
          ))}
        </div>
      )}
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
  /** the child component accepted by the Input one */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  /** The hook referencing the input */
  inputRef: PropTypes.object,
  /** in the case of a radio input, an array of the possible options the user can choose */
  options: PropTypes.arrayOf(PropTypes.object),
  /** the value that will be set in the option */
  value: PropTypes.string,
  /** the handler function when the value of the input changes */
  onChange: PropTypes.func,
};

export default Input;
