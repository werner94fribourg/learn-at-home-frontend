import Button from '../../UI/Button/Button';
import styles from './Form.module.scss';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

/**
 * Form component in the ProfilePage, representing a form to modify datas of the connected user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Form = props => {
  const { name, children, onSubmit } = props;
  return (
    <Fragment>
      <h2 className={styles['form__title']}>{name}</h2>
      <form className="form form-user-data" onSubmit={onSubmit}>
        {children}
        <Button
          className={styles['form__submit-btn']}
          text="Save settings"
          type="submit"
        />
      </form>
    </Fragment>
  );
};

Form.propTypes = {
  /** the title of the form */
  name: PropTypes.string,
  /** the child component accepted by the Form */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  /** the handler function called when the user submits the form */
  onSubmit: PropTypes.func,
};

export default Form;
