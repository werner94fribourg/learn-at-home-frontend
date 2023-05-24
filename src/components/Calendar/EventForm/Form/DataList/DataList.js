import { logout } from '../../../../../store/slice/auth';
import { getExistingMembers } from '../../../../../utils/api';
import LoadingSpinner from '../../../../UI/LoadingSpinner/LoadingSpinner';
import styles from './DataList.module.scss';
import PropTypes from 'prop-types';
import { useAsync } from 'react-async';
import { useDispatch, useSelector } from 'react-redux';

/**
 * DataList component in the Form one, representing the list of users we can invite to an event
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const DataList = props => {
  const { jwt } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { onChange } = props;

  const { data, error, isPending } = useAsync({
    promiseFn: getExistingMembers,
    token: jwt,
  });

  if (data && !data.authorized) logout(dispatch);

  const changeHandler = user => {
    onChange(user);
  };

  return (
    <ul className={styles.datalist}>
      {isPending && (
        <LoadingSpinner
          style={{
            zIndex: 100,
            padding: '2rem 0',
          }}
        />
      )}
      {error && <h3>Something went wrong.</h3>}
      {data && !data.valid && <h3>Something went wrong.</h3>}
      {data?.valid &&
        data.users.map(user => (
          <li
            className={styles['datalist__choice']}
            key={user._id}
            value={user.username}
            data-user={JSON.stringify(user)}
            data-username={user.username}
            onClick={changeHandler.bind(null, user)}
          >
            {user.username}
          </li>
        ))}
    </ul>
  );
};

DataList.propTypes = {
  /** the handler function called when the user clicks on an user in the datalist */
  onChange: PropTypes.func,
};

export default DataList;
