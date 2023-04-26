import Layout from '../components/Layout/Layout';
import MessageNotification from '../components/UI/MessageNotification/MessageNotification';
import TeachingDemands from '../pages/TeachingDemands';
import { logout } from '../store/slice/auth';
import {
  getLastConversation,
  getTotalUnread,
  notifyMessage,
  receiveMessage,
  incrementConversationUnread,
} from '../store/slice/messages';
import { setUserConnectionStatus } from '../store/slice/users';
import { getSocket, setSocket } from '../utils/utils';
import loadable from '@loadable/component';
import { Fragment, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router';

const Dashboard = loadable(() => import('../pages/Dashboard'));
const Profile = loadable(() => import('../pages/Profile'));
const Conversations = loadable(() => import('../pages/Conversations'));
const Members = loadable(() => import('../pages/Members'));

/**
 * Router of the application (user logged in)
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const ProfileRouter = () => {
  const {
    auth: { jwt },
    users: {
      me: { _id: userId },
      activeUser: { id: activeUser },
    },
    messages: { notification },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  if (!getSocket() && userId) setSocket(userId);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on('receive_message', async message => {
        if (!jwt) return;
        const {
          sender: { _id: senderId },
          receiver: { _id: receiverId },
        } = message;
        if (receiverId !== userId) return;
        if (senderId === activeUser) {
          receiveMessage(message, dispatch);
          if (pathname !== '/conversations') notifyMessage(message, dispatch);
        } else notifyMessage(message, dispatch);
        let authorized = await getLastConversation(jwt, senderId, dispatch);
        if (!authorized) {
          logout(dispatch);
          return;
        }
        authorized = await getTotalUnread(jwt, dispatch);
        if (!authorized) {
          logout(dispatch);
          return;
        }
        if (senderId !== activeUser)
          incrementConversationUnread(senderId, receiverId, dispatch);
      });
      socket.on('notify_connection', data => {
        const { userId, connected } = data;

        if (activeUser === userId) setUserConnectionStatus(connected, dispatch);
      });
    }
    return () => {
      socket?.off('receive_message');
      socket?.off('notify_connection');
    };
  }, [jwt, userId, activeUser, dispatch, pathname]);

  return (
    <Fragment>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/teaching" element={<TeachingDemands />} />
          <Route path="/members" element={<Members />} />
          <Route path="*" element={<Navigate to="/" replace />} replace />
        </Routes>
      </Layout>
      {notification &&
        createPortal(
          <MessageNotification message={notification} />,
          document.querySelector('#root')
        )}
    </Fragment>
  );
};

ProfileRouter.propTypes = {};

export default ProfileRouter;
