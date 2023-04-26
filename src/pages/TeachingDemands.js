import SideNav from '../components/SideNav/SideNav';
import styles from './Layout.module.scss';
import teachingStyles from './TeachingDemands.module.scss';

const TeachingDemands = () => {
  return (
    <div className={styles.layout}>
      <SideNav />
      <div
        className={`${styles['layout__content']} ${teachingStyles.teaching}`}
      ></div>
    </div>
  );
};

export default TeachingDemands;
