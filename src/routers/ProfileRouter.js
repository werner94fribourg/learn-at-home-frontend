import Layout from '../components/Layout/Layout';
import MessageNotification from '../components/UI/MessageNotification/MessageNotification';
import Notification from '../components/UI/Notification/Notification';
import Calendar from '../pages/Calendar';
import TeachingDemands from '../pages/TeachingDemands';
import { logout } from '../store/slice/auth';
import {
  eventDeleted,
  eventModified,
  participationAccepted,
  participationDeclined,
  receiveEvent,
  receiveModifiedEvent,
  getUserTodayEvents,
} from '../store/slice/calendar';
import {
  getLastConversation,
  getTotalUnread,
  notifyMessage,
  receiveMessage,
  incrementConversationUnread,
} from '../store/slice/messages';
import {
  notifyTask,
  receiveCreatedTask,
  receiveTask,
} from '../store/slice/tasks';
import {
  cancelDemandInStore,
  demandAccepted,
  demandCancelled,
  receiveTeachingDemand,
} from '../store/slice/teaching-demands';
import {
  addUserToContactList,
  invitationAccepted,
  receiveInvitation,
  removeUserFromContactList,
  setUserConnectionStatus,
  getSupervision,
  setSupervisionStatus,
} from '../store/slice/users';
import { getSocket, setSocket } from '../utils/utils';
import loadable from '@loadable/component';
import moment from 'moment-timezone';
import { Fragment, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router';

const Dashboard = loadable(() => import('../pages/Dashboard'));
const Profile = loadable(() => import('../pages/Profile'));
const Conversations = loadable(() => import('../pages/Conversations'));
const Members = loadable(() => import('../pages/Members'));
const Tasks = loadable(() => import('../pages/Tasks'));

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
      me: { _id: userId, role, supervisor, username },
      activeUser: { id: activeUser },
      notificationData: usersNotificationData,
    },
    messages: { notification },
    demands: { notificationData: demandsNotificationData },
    calendar: { notificationData: eventsNotificationData },
    tasks: { notificationData: tasksNotificationData },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  if (!getSocket() && userId) setSocket(userId);

  useEffect(() => {
    if (role === 'student') {
      getSupervision(jwt, dispatch);
    }

    const getTodayEvents = async () => {
      const authorized = await getUserTodayEvents(jwt, dispatch);
      if (!authorized) logout(dispatch);
    };
    getTodayEvents();
  }, [jwt, role, dispatch]);

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
      socket.on('receive_invitation', invitation => {
        const { sender, receiver } = invitation;

        if (receiver.id !== userId) return;

        receiveInvitation(sender, dispatch);
      });
      socket.on('invitation_accepted', async invitation => {
        const { sender, receiver } = invitation;

        if (sender.id !== userId) return;

        invitationAccepted(receiver, dispatch);
        const authorized = await addUserToContactList(receiver.id, dispatch);
        if (!authorized) logout(dispatch);
      });
      socket.on('contact_removed', data => {
        const { sender, receiver } = data;

        if (receiver !== userId) return;

        removeUserFromContactList(sender, dispatch);
      });
      socket.on('receive_teaching_demand', demand => {
        const { receiver } = demand;

        if (receiver._id !== userId) return;

        receiveTeachingDemand(demand, dispatch);
      });
      socket.on('teaching_demand_accepted', demand => {
        const { sender } = demand;

        if (sender._id !== userId) return;

        demandAccepted(demand, dispatch);
        setSupervisionStatus(true, dispatch);
      });
      socket.on('teaching_demand_cancelled', demand => {
        const { sender } = demand;

        if (sender._id !== userId) {
          if (role === 'teacher') cancelDemandInStore(sender._id, dispatch);
          return;
        }

        demandCancelled(demand, dispatch);
      });
      socket.on('receive_event', event => {
        const { guests } = event;

        if (!guests.includes(userId)) return;

        receiveEvent(event, dispatch);
      });
      socket.on('event_accepted', data => {
        const {
          event,
          event: { organizer: organizerId },
          sender,
        } = data;

        if (organizerId !== userId) return;

        participationAccepted(event, sender, dispatch);
      });
      socket.on('event_declined', data => {
        const {
          event,
          event: { organizer: organizerId },
          sender,
        } = data;

        if (organizerId !== userId) return;

        participationDeclined(event, sender, dispatch);
      });
      socket.on('event_modified', data => {
        const {
          initialBeginning,
          initialEnd,
          username,
          event,
          event: { guests, attendees },
        } = data;

        if (guests.includes(userId)) {
          receiveEvent(event, dispatch);
          return;
        }

        if (!attendees.includes(userId)) return;

        receiveModifiedEvent(event, dispatch);

        const newBeginning = moment(event.beginning).tz('Europe/Zurich');
        const newEnd = moment(event.end).tz('Europe/Zurich');
        if (
          initialBeginning !== newBeginning.valueOf() ||
          initialEnd !== newEnd.valueOf()
        )
          eventModified(event, username, dispatch);
      });
      socket.on('event_deleted', data => {
        const {
          username,
          event,
          event: { guests: guestArray, attendees: attendeesArray },
        } = data;

        const guests = guestArray.map(guest => {
          if (typeof guest === 'object') return guest._id;

          return guest;
        });
        const attendees = attendeesArray.map(attendee => {
          if (typeof attendee === 'object') return attendee._id;

          return attendee;
        });
        if (!guests.includes(userId) && !attendees.includes(userId)) return;

        eventDeleted(event, username, dispatch);
      });
      socket.on('task_completed', data => {
        const { task, supervisor: taskSupervisor } = data;
        if (taskSupervisor._id !== userId) return;

        receiveTask(task, role, dispatch);
        notifyTask(task, taskSupervisor.username, dispatch);
      });
      socket.on('task_validated', task => {
        const { performer } = task;

        if (performer !== userId) return;
        receiveTask(task, role, dispatch);
        notifyTask(task, username, dispatch);
      });
      socket.on('task_created', data => {
        const {
          task,
          task: { performer },
          creator,
          supervisor: taskSupervisor,
        } = data;
        if (role === 'student' && performer._id !== userId) return;

        if (role === 'teacher' && taskSupervisor?._id !== userId) return;

        receiveCreatedTask(task, dispatch);
        notifyTask(task, creator, dispatch);
      });
    }
    return () => {
      socket?.off('receive_message');
      socket?.off('notify_connection');
      socket?.off('receive_invitation');
      socket?.off('invitation_accepted');
      socket?.off('contact_removed');
      socket?.off('receive_teaching_demand');
      socket?.off('teaching_demand_accepted');
      socket?.off('teaching_demand_cancelled');
      socket?.off('receive_event');
      socket?.off('event_accepted');
      socket?.off('event_declined');
      socket?.off('event_modified');
      socket?.off('event_deleted');
      socket?.off('task_completed');
      socket?.off('task_validated');
      socket?.off('task_created');
    };
  }, [jwt, userId, role, activeUser, dispatch, pathname, supervisor, username]);

  return (
    <Fragment>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/teaching" element={<TeachingDemands />} />
          <Route path="/members/*" element={<Members />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="*" element={<Navigate to="/" replace />} replace />
        </Routes>
      </Layout>
      {notification &&
        createPortal(
          <MessageNotification message={notification} />,
          document.querySelector('#root')
        )}
      {usersNotificationData &&
        createPortal(
          <Notification
            id={usersNotificationData.id}
            title="Invitation"
            username={usersNotificationData.username}
            message={usersNotificationData.message}
            status={usersNotificationData.valid}
            type={usersNotificationData.type}
          />,
          document.querySelector('#root')
        )}
      {demandsNotificationData &&
        createPortal(
          <Notification
            id={demandsNotificationData.id}
            title="Teaching demand request"
            username={demandsNotificationData.username}
            message={demandsNotificationData.message}
            status={demandsNotificationData.valid}
            type={demandsNotificationData.type}
          />,
          document.querySelector('#root')
        )}
      {eventsNotificationData &&
        createPortal(
          <Notification
            id={eventsNotificationData.id}
            title={eventsNotificationData.title}
            username={eventsNotificationData.username}
            message={eventsNotificationData.message}
            status={eventsNotificationData.valid}
            type={eventsNotificationData.type}
            beginning={eventsNotificationData.beginning}
            end={eventsNotificationData.end}
            accepted={eventsNotificationData.accepted}
          />,
          document.querySelector('#root')
        )}
      {tasksNotificationData &&
        createPortal(
          <Notification
            id={tasksNotificationData.id}
            title={tasksNotificationData.title}
            username={tasksNotificationData.username}
            message={tasksNotificationData.message}
            status={tasksNotificationData.valid}
            type={tasksNotificationData.type}
            validated={tasksNotificationData.validated}
          />,
          document.querySelector('#root')
        )}
    </Fragment>
  );
};

ProfileRouter.propTypes = {};

export default ProfileRouter;
