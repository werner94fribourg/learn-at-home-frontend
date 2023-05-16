import { logout } from '../../store/slice/auth';
import {
  deleteContact,
  getMembers,
  invite,
  setActiveUser,
} from '../../store/slice/users';
import { getSocket, isContact } from '../../utils/utils';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import UserCard from '../UI/UserCard/UserCard';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

/**
 * Members component in the the all members page, representing the list of existing members in the application
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Members = () => {
  const {
    users: {
      members,
      membersLoading: loading,
      contacts,
      me: { _id: connectedId, username: connectedUsername },
    },
    auth: { jwt },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = getSocket();

  useEffect(() => {
    const getAllMembers = async () => {
      const authorized = await getMembers(jwt, dispatch);
      if (!authorized) logout(dispatch);
    };
    getAllMembers();
  }, [jwt, dispatch]);

  if (members.length === 0 || loading)
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

  const inviteHandler = async (id, username) => {
    const [valid, authorized] = await invite(jwt, id, username, dispatch);
    if (!authorized) logout(dispatch);

    if (valid && socket)
      socket.emit('send_invitation', {
        sender: { id: connectedId, username: connectedUsername },
        receiver: { id, username },
      });
  };

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
      {members.map(user => (
        <UserCard
          key={user._id}
          firstname={user.firstname}
          lastname={user.lastname}
          username={user.username}
          photo={user.photo}
          left={{
            text: isContact(user._id, contacts) ? 'Delete' : 'Add',
            onClick: isContact(user._id, contacts)
              ? deleteHandler.bind(null, user._id, user.username)
              : inviteHandler.bind(null, user._id, user.username),
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

Members.propTypes = {};

export default Members;
