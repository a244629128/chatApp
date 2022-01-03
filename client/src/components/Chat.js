/* eslint-disable no-unused-vars */
import react, { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import onlineIcon from '../icons/onlineIcon.png';

function Chat({ updateRoom,setRoom, socket, userName, room, roomList, userList, setRoomList, setUserList, joinRoom }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: userName,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
      };
      await socket.emit('send_message', messageData);
      setMessageList((prevList) => {
        return [...prevList, messageData];
      })
      setCurrentMessage("");
    }
  };
  useEffect(() => {
    console.log('trigger socket effect2');
    socket.on('receive_message', (data) => {
      setMessageList((prevList) => {
        return [...prevList, data];
      })
    })
    socket.on('receive_roomList', (data, data2) => {
      setRoomList(data);
      setUserList(data2);
    })
    socket.on('disconnect_list', (data, data2) => {
      console.log('trigger disconnect socket effect:', data, data2);
      setRoomList(data);
      setUserList(data2);
    })
  }, [socket])

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>Live Chat (At Room:{room})</p>
      </div>
      <div className='chat-roomList'>
        <h4>Room list</h4>
        <ScrollToBottom className='roomId'>
          {roomList.map((e, index) => {
            return (
              <div onClick={(e)=>{joinRoom(e.target.innerHTML);}}>
                {e.roomId}
              </div>
            )
          })}
        </ScrollToBottom>
        </div>
      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          {messageList.map((e, index) => {
            return (
              <div key={index} className='message' id={userName === e.author ? 'you' : 'other'}>
                <div>
                  <div className='message-content'>
                    <p>{e.message}</p>
                  </div>
                  <div>
                    <div className="message-meta">
                      <p id="time">{e.time}</p>
                      <p id="author">{e.author}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </ScrollToBottom>
        <ScrollToBottom className='chat-list'>
          <h4>Online users</h4>
          {userList.map((e, index) => {
            return (
              <div>
                {e}
                <img alt="Online Icon" src={onlineIcon} />
              </div>
            )
          })}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input type='text'
          placeholder='Hey...'
          value={currentMessage}
          onChange={(e) => { setCurrentMessage(e.target.value) }}
          onKeyPress={(e) => { e.key === 'Enter' && sendMessage(); }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;