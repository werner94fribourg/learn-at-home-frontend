import { PROFILE_PICTURES_URL } from '../../../../utils/globals';
import styles from './Student.module.scss';
import PropTypes from 'prop-types';

/**
 * Student component in the Dashboard page, representing a student displayed in the list of supervised students
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Student = props => {
  const { username, photo } = props;

  return (
    <div className={styles.student}>
      <img
        className={styles['student__picture']}
        src={`${PROFILE_PICTURES_URL}/${photo}`}
        alt="werner94fribourg"
      />
      <h3 className={styles['student__username']}>{username}</h3>
    </div>
  );
};

Student.propTypes = {
  /** The username of the student */
  username: PropTypes.string,
  /** the profile picture of the student */
  photo: PropTypes.string,
};

export default Student;
