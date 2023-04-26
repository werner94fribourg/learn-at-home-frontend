import SideNav from '../components/SideNav/SideNav';
import styles from './Layout.module.scss';
import membersStyles from './Members.module.scss';

const Members = () => {
  return (
    <div className={styles.layout}>
      <SideNav />
      <div
        className={`${styles['layout__content']} ${membersStyles.conversations}`}
      ></div>
    </div>
  );
};

export default Members;
