import { initialize } from '../../store/slice/auth';
import { getTotalUnread } from '../../store/slice/messages';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UnreadCount = props => {
  const {
    auth: { jwt },
    messages: { totalUnread },
  } = useSelector(state => state);

  const dispatch = useDispatch();
  const { className } = props;

  useEffect(() => {
    const getTotalCount = async () => {
      if (totalUnread === -1) {
        const authorized = await getTotalUnread(jwt, dispatch);
        if (!authorized) {
          initialize('', dispatch);
          localStorage.removeItem('jwt');
        }
      }
    };

    getTotalCount();
  }, [jwt, totalUnread, dispatch]);

  if (totalUnread < 0) {
    return <span></span>;
  }

  return <span className={className}>{totalUnread}</span>;
};

export default UnreadCount;
