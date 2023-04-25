import { getSupervisedStudents } from '../../../utils/api';
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import Student from './Student/Student';
import styles from './Students.module.scss';
import { useAsync } from 'react-async';
import { useSelector } from 'react-redux';

/**
 * Students component in the Dashboard page, representing the list of supervised students in the case where the connected user is a teacher
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Students = () => {
  const { jwt } = useSelector(state => state.auth);
  const { data, error, isPending } = useAsync({
    promiseFn: getSupervisedStudents,
    token: jwt,
  });
  return (
    <div className={styles.students}>
      <h2 className={styles['students__title']}>My students</h2>
      <div className={styles['students__list']}>
        {isPending && (
          <LoadingSpinner
            style={{
              gridColumn: '1 / 5',
              backgroundColor: 'white',
              zIndex: '100',
            }}
          />
        )}
        {(error || !data?.valid) && <h3>Something went wrong.</h3>}
        {data?.valid &&
          data.users.map(student => (
            <Student
              key={student._id}
              username={student.username}
              photo={student.photo}
            />
          ))}
      </div>
    </div>
  );
};

Students.propTypes = {};

export default Students;
