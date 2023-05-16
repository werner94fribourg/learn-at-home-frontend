import { logout } from '../../store/slice/auth';
import {
  acceptInvitation,
  addUserToContactList,
  decline,
} from '../../store/slice/users';
import { getSocket } from '../../utils/utils';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import UserCard from '../UI/UserCard/UserCard';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Invitations component in the the invitations page, representing the list of users that sent a contact invitation to the logged user
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const Invitations = () => {
  const {
    users: {
      invitations,
      invitationsLoading: loading,
      me: { _id: connectedId, username: connectedUsername },
    },

    auth: { jwt },
  } = useSelector(state => state);
  const dispatch = useDispatch();
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

  if (invitations.length === 0) return <div>No pending invitations.</div>;

  const refuseHandler = async id => {
    const authorized = await decline(jwt, id, dispatch);

    if (!authorized) {
      logout(dispatch);
    }
  };

  const acceptHandler = async user => {
    const { id, username } = user;
    const [valid, authorized] = await acceptInvitation(jwt, id, dispatch);
    if (!authorized) logout(dispatch);

    if (valid && socket) {
      socket.emit('accept_invitation', {
        sender: { id, username },
        receiver: { id: connectedId, username: connectedUsername },
      });
      await addUserToContactList(id, dispatch);
    }
  };

  return (
    <Fragment>
      {invitations.map(user => (
        <UserCard
          key={user._id}
          firstname={user.firstname}
          lastname={user.lastname}
          username={user.username}
          photo={user.photo}
          left={{
            text: 'Refuse',
            onClick: refuseHandler.bind(null, user._id),
          }}
          right={{
            text: 'Accept',
            onClick: acceptHandler.bind(null, {
              id: user._id,
              username: user.username,
            }),
          }}
        />
      ))}
    </Fragment>
  );
};

Invitations.propTypes = {};

export default Invitations;
