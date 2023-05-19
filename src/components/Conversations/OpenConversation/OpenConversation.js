import { logout } from '../../../store/slice/auth';
import {
  addMessage,
  addMessageWithFiles,
  getLastConversation,
} from '../../../store/slice/messages';
import { getUserConnectionStatus } from '../../../store/slice/users';
import { getSocket } from '../../../utils/utils';
import Button from '../../UI/Button/Button';
import Messages from './Messages/Messages';
import styles from './OpenConversation.module.scss';
import {
  faFaceGrin,
  faPaperPlane,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * OpenConversation component in the Conversations page, representing the currently opened conversation
 *
 * @version 1.0.0
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const OpenConversation = () => {
  const {
    auth: { jwt },
    users: {
      activeUser: { id: activeUserId, username: activeUsername },
      online,
    },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  const messageRef = useRef(null);
  const filesRef = useRef(null);
  const formRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const socket = getSocket();

  useEffect(() => {
    const getStatus = async () => {
      if (!jwt || !activeUserId) return;
      const authorized = await getUserConnectionStatus(
        jwt,
        activeUserId,
        dispatch
      );

      if (!authorized) logout(dispatch);
    };

    getStatus();
  }, [jwt, activeUserId, dispatch]);

  const plusHandler = () => {
    filesRef.current.click();
  };

  let statusClassNames = styles['open-conversation__status'];

  if (online) {
    statusClassNames += ` ${styles['open-conversation__status--online']}`;
  }

  const uploadFileHandler = event => {
    const {
      target: { files: fileList },
    } = event;
    const files = Array.from(fileList);

    const newFiles = files.filter(file => uploadedFiles.indexOf(file) === -1);
    const nonRemovedFiles = uploadedFiles.filter(
      file => files.indexOf(file) !== -1
    );
    setUploadedFiles([...nonRemovedFiles, ...newFiles]);
  };

  const messageFormHandler = async event => {
    event.preventDefault();

    const {
      current: { value: content },
    } = messageRef;
    const {
      current: { files },
    } = filesRef;
    let status, returnedMessage, valid;
    if (files.length > 0) {
      const form = new FormData(formRef.current);
      const {
        authorized,
        valid: validSent,
        message,
      } = await addMessageWithFiles(jwt, activeUserId, form, dispatch);
      status = authorized;
      returnedMessage = message;
      valid = validSent;
      setUploadedFiles([]);
    } else {
      const {
        valid: validSent,
        authorized,
        message,
      } = await addMessage(jwt, activeUserId, content, dispatch);
      status = authorized;
      returnedMessage = message;
      valid = validSent;
    }

    if (!status) logout(dispatch);

    status = await getLastConversation(jwt, activeUserId, dispatch);

    if (!status) logout(dispatch);

    if (valid) socket.emit('send_message', returnedMessage);
    messageRef.current.value = '';
    filesRef.current.value = '';
  };

  return (
    <div className={styles['open-conversation']}>
      <div className={styles['open-conversation__user']}>
        <h3 className={styles['open-conversation__username']}>
          {activeUsername}
        </h3>
        <span className={statusClassNames}>
          {online ? 'Online' : 'Offline'}
        </span>
      </div>
      <Messages className={styles['open-conversation__messages']} />
      <form
        className={styles['open-conversation__form']}
        onSubmit={messageFormHandler}
        ref={formRef}
      >
        <FontAwesomeIcon
          className={styles['open-conversation__smiley']}
          icon={faFaceGrin}
        />
        <input
          className={styles['open-conversation__input']}
          id="content"
          name="content"
          type="text"
          placeholder="Write a message..."
          ref={messageRef}
        />
        <FontAwesomeIcon
          className={styles['open-conversation__plus']}
          icon={faPlus}
          onClick={plusHandler}
        />
        <input
          className={styles['open-conversation__files']}
          id="files"
          name="files"
          type="file"
          multiple="multiple"
          accept="image/png, image/jpeg"
          ref={filesRef}
          onChange={uploadFileHandler}
        />
        <Button
          className={styles['open-conversation__submit']}
          type="submit"
          text={<FontAwesomeIcon icon={faPaperPlane} />}
        />
      </form>
      {uploadedFiles.length > 0 && (
        <ul className={styles['open-conversation__files-list']}>
          {uploadedFiles.map(file => (
            <li
              className={styles['open-conversation__file-item']}
              key={file.name}
            >
              {file.name}
            </li>
          ))}
        </ul>
      )}
      <div></div>
    </div>
  );
};

OpenConversation.propTypes = {};

export default OpenConversation;
