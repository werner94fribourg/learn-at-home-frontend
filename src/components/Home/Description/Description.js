import styles from './Description.module.scss';
import logo from './logo.png';

/**
 * Description component in the Home page, representing the left red banner when accessing this page
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Description = () => {
  return (
    <section className={styles.description}>
      <span className={styles['description__header']}>Learn@Home</span>
      <div className={styles['description__logo-container']}>
        <img
          className={styles['description__logo']}
          src={logo}
          alt="Learn@Home"
        />
        <h1 className={styles['description__title']}>Learn@Home</h1>
      </div>
      <div className={styles['description__subtitle-container']}>
        <h2 className={styles['description__subtitle']}>
          Digital tutoring platform
        </h2>
        <p className={styles['description__text']}>
          Helping students overcome their learning difficulties
        </p>
      </div>
    </section>
  );
};

Description.propTypes = {};

export default Description;
