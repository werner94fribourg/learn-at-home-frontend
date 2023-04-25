import styles from './LoadingSpinner.module.scss';
import PropTypes from 'prop-types';

/**
 * Component representing a loading spinner in the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const LoadingSpinner = props => {
  const { style } = props;
  return (
    <div className={styles['spinner-container']} style={style}>
      <div className={styles['loading-spinner']}></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  /** the custom styles we want to associate with the loading spinner */
  style: PropTypes.object,
};

export default LoadingSpinner;
