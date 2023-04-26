import { logout } from '../../store/slice/auth';
import { getTotalUnread } from '../../store/slice/messages';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Component representing the number of unread messages displayed in the Navbar
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const UnreadCount = props => {
  const {
    auth: { jwt },
    messages: { totalUnread },
  } = useSelector(state => state);

  const dispatch = useDispatch();
  const { className } = props;

  useEffect(() => {
    const getTotalCount = async () => {
      if (!jwt) return;
      if (totalUnread === -1) {
        const authorized = await getTotalUnread(jwt, dispatch);
        if (!authorized) logout(dispatch);
      }
    };

    getTotalCount();
  }, [jwt, totalUnread, dispatch]);

  if (totalUnread < 0) {
    return <span></span>;
  }

  return <span className={className}>{totalUnread}</span>;
};

UnreadCount.propTypes = {
  /** The class(es) we want to associate with the UnreadCount component */
  className: PropTypes.string,
};

export default UnreadCount;
