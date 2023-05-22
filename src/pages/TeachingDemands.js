import SideNav from '../components/SideNav/SideNav';
import DemandList from '../components/TeachingDemands/DemandList/DemandList';
import SendTeachingDemandForm from '../components/TeachingDemands/SendTeachingDemandForm/SendTeachingDemandForm';
import { logout } from '../store/slice/auth';
import { getDemands } from '../store/slice/teaching-demands';
import styles from './Layout.module.scss';
import teachingStyles from './TeachingDemands.module.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Component representing the TeachingDemands pages (all, contacts, invitations) of the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const TeachingDemands = () => {
  const {
    users: {
      me: { role },
      supervised,
    },
    auth: { jwt },
  } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllDemands = async () => {
      const authorized = await getDemands(jwt, dispatch);
      if (!authorized) logout(dispatch);
    };

    getAllDemands();
  }, [jwt, dispatch]);

  return (
    <div className={styles.layout}>
      <SideNav />
      <div
        className={`${styles['layout__content']} ${teachingStyles.teaching}`}
      >
        {role === 'student' && !supervised && <SendTeachingDemandForm />}
        <DemandList />
      </div>
    </div>
  );
};

TeachingDemands.propTypes = {};

export default TeachingDemands;
