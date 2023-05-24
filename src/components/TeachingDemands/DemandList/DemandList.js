import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import Demand from './Demand/Demand';
import styles from './DemandList.module.scss';
import { useSelector } from 'react-redux';

/**
 * DemandList component in the the teaching demands page, representing the list of existing teaching demands involving the connected user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const DemandList = () => {
  const {
    users: {
      me: { role },
    },
    demands: { demands, loading },
  } = useSelector(state => state);

  return (
    <table className={styles['demand-list']} cellSpacing={0}>
      <thead className={styles['demand-list__head']}>
        <tr className={styles['demand-list__head-row']}>
          <th scope="col" className={styles['demand-list__cell']}>
            #
          </th>
          <th scope="col" className={styles['demand-list__cell']}>
            {role === 'student' ? 'Teacher' : 'Student'}
          </th>
          <th scope="col" className={styles['demand-list__cell']}>
            Sending date
          </th>
          <th
            scope="col"
            className={`${styles['demand-list__cell']} ${styles['demand-list__cell--action']}`}
          >
            {role === 'student' ? 'Accepted' : 'Accept(ed)'}
          </th>
          <th
            scope="col"
            className={`${styles['demand-list__cell']} ${styles['demand-list__cell--action']}`}
          >
            Cancel(led)
          </th>
        </tr>
      </thead>
      <tbody className={styles['demand-list__body']}>
        {loading && (
          <tr>
            <td colSpan="5">
              <LoadingSpinner style={{ padding: '4rem 0' }} />
            </td>
          </tr>
        )}
        {!loading && demands.length === 0 && (
          <tr>
            <td colSpan="5" className={styles['demand-list__empty-message']}>
              No demands available
            </td>
          </tr>
        )}
        {demands.map((demand, index) => (
          <Demand
            key={demand._id}
            id={demand._id}
            rowNumber={index + 1}
            username={
              demand[role === 'student' ? 'receiver' : 'sender'].username
            }
            sent={demand.sent}
            accepted={demand.accepted}
            cancelled={demand.cancelled}
          />
        ))}
      </tbody>
    </table>
  );
};

DemandList.propTypes = {};

export default DemandList;
