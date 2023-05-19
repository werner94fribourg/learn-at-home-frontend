import Button from '../Button/Button';
import styles from './UserCard.module.scss';
import PropTypes from 'prop-types';

/**
 * Component representing a usercard in the members, contacts and invitations pages
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const UserCard = props => {
  const {
    firstname,
    lastname,
    username,
    photo,
    left: { text: leftText, onClick: leftAction },
    right: { text: rightText, onClick: rightAction },
  } = props;
  return (
    <div className={styles.usercard}>
      <img className={styles['usercard__picture']} src={photo} alt={username} />
      <h2 className={styles['usercard__name']}>
        {`${firstname} ${lastname}`} <br />({username})
      </h2>
      <div className={styles['usercard__actions']}>
        <Button
          className={`${styles['usercard__action']} ${styles['usercard__action--left']}`}
          text={leftText}
          type="button"
          onClick={leftAction}
        />
        <Button
          className={`${styles['usercard__action']} ${styles['usercard__action--right']}`}
          text={rightText}
          type="button"
          onClick={rightAction}
        />
      </div>
    </div>
  );
};

UserCard.propTypes = {
  /** the firstname of the displayed user */
  firstname: PropTypes.string,
  /** the lastname of the displayed user */
  lastname: PropTypes.string,
  /** the username of the displayed user */
  username: PropTypes.string,
  /** the profile picture of the displayed user */
  photo: PropTypes.string,
  /** an object containing the text and the handler function of the left button */
  left: PropTypes.object,
  /** an object containing the text and the handler function of the right button */
  right: PropTypes.object,
};

export default UserCard;
