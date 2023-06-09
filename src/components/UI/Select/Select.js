import styles from './Select.module.scss';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

/**
 * Component representing a customed select input in the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Select = props => {
  const { className, selectTitle, name, users, optionTitle } = props;
  const [clicked, setClicked] = useState(false);
  const [selected, setSelected] = useState({ id: '', name: selectTitle });
  const optionsRef = useRef(null);
  const selectRef = useRef(null);

  let iconClassName = styles['select__icon'];

  if (clicked) iconClassName += ` ${styles.clicked}`;

  const clickHandler = () => {
    setClicked(prevState => !prevState);
  };

  const selectHandler = user => {
    const options = selectRef.current;
    const option = options.querySelector(`option[value="${user.id}"]`);
    option.selected = true;
    setSelected(user);
  };

  useEffect(() => {
    const clickFunction = event => {
      const { target } = event;

      const select = target.closest(`.${styles.select}.${className}`);

      if (select) return;

      setClicked(false);
    };
    document.querySelector('#root')?.addEventListener('click', clickFunction);

    return () => {
      document.removeEventListener('click', clickFunction);
    };
  }, [className]);

  return (
    <div className={`${styles.select} ${className}`} onClick={clickHandler}>
      <div className={styles['select__title']}>{selected.name}</div>
      <CSSTransition
        nodeRef={optionsRef}
        in={clicked}
        timeout={500}
        classNames={{
          enter: styles['select__options-enter'],
          enterActive: styles['select__options-enter-active'],
          enterDone: styles['select__options-enter-done'],
          exit: styles['select__options-exit'],
          exitActive: styles['select__options-exit-active'],
          exitDone: styles['select__options-exit-done'],
        }}
        mountOnEnter
        unmountOnExit
      >
        <div className={styles['select__options']} ref={optionsRef}>
          {users.map(user => (
            <div
              key={`div__${user._id}`}
              className={styles['select__option']}
              onClick={selectHandler.bind(null, {
                id: user._id,
                name: user.username,
              })}
            >
              {user.username} ({user.firstname} {user.lastname})
            </div>
          ))}
        </div>
      </CSSTransition>
      <select
        className={`${styles['select__list']}`}
        id={name}
        name={name}
        onChange={selectHandler}
        ref={selectRef}
        defaultValue={''}
      >
        <option value="">{optionTitle}</option>
        {users.map(user => (
          <option key={`option__${user._id}`} value={user._id}>
            {user.username}
          </option>
        ))}
      </select>
      <FontAwesomeIcon className={iconClassName} icon={faChevronDown} />
    </div>
  );
};

Select.propTypes = {
  /** The class(es) we want to associate with the Select component */
  className: PropTypes.string,
  /** The title of the selection input (displayed) when no item was choosen */
  selectTitle: PropTypes.string,
  /** the name of the select input field */
  name: PropTypes.string,
  /** the users we want to choose from the select input field */
  users: PropTypes.arrayOf(PropTypes.object),
  /** the title displayed in the select (not displayed) if no value was choosen */
  optionTitle: PropTypes.string,
};

export default Select;
