import { logout } from '../../store/slice/auth';
import { deleteContact, setActiveUser } from '../../store/slice/users';
import { getSocket } from '../../utils/utils';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import UserCard from '../UI/UserCard/UserCard';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

/**
 * Contacts component in the the contacts page, representing the list of contacts of the logged user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Contacts = () => {
  const {
    users: {
      contacts,
      contactsLoading: loading,
      me: { _id: connectedId },
    },
    auth: { jwt },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = getSocket();

  if (loading)
    return (
      <LoadingSpinner
        style={{
          padding: '0',
          position: 'absolute',
          left: '50%',
          top: '10rem',
          transform: 'translateX(-50%)',
        }}
      />
    );

  if (contacts.length === 0) return <div>No contact added.</div>;

  const deleteHandler = async (id, username) => {
    const [valid, authorized] = await deleteContact(
      jwt,
      id,
      username,
      dispatch
    );
    if (!authorized) logout(dispatch);

    if (valid && socket)
      socket.emit('remove_contact', {
        sender: connectedId,
        receiver: id,
      });
  };

  const chatHandler = async user => {
    setActiveUser(user, dispatch);
    navigate('/conversations');
  };

  return (
    <Fragment>
      {contacts.map(user => (
        <UserCard
          key={user._id}
          firstname={user.firstname}
          lastname={user.lastname}
          username={user.username}
          photo={user.photo}
          left={{
            text: 'Delete',
            onClick: deleteHandler.bind(null, user._id, user.username),
          }}
          right={{
            text: 'Chat',
            onClick: chatHandler.bind(null, {
              id: user._id,
              username: user.username,
            }),
          }}
        />
      ))}
    </Fragment>
  );
};

Contacts.propTypes = {};

export default Contacts;
