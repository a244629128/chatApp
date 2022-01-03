/* eslint-disable no-unused-vars */
import "./App.css";
import io from "socket.io-client";
import react, { useState, useEffect } from "react";
import Chat from './components/Chat.js';

const socket = io.connect('https://react-realtime-chatappp.herokuapp.com/');

function App() {
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');
  const [roomList, setRoomList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [showChat, setShowChat] = useState(false);

  const joinRoom = async (targetRoom) => {
    let temp = room;
    if(typeof targetRoom === 'string') {
      temp = targetRoom;
      await setRoom(targetRoom);
    }
    if (userName !== '' && room !== '') {
      await socket.emit('join_room', temp, userName);
      socket.on('receive_roomList', (data, data2) => {
        setRoomList(data);
        setUserList(data2);
      })
      setShowChat(true);
    }
    return;
  }
  const updateRoom = async (targetRoom) => {
    console.log('update room:', targetRoom);
    await socket.emit('join_room', targetRoom, userName);
    socket.on('receive_roomList', (data, data2) => {
      setRoomList(data);
      setUserList(data2);
    })
  }

  return (
    <div className='App'>
      {!showChat ?
        <div className='joinChatContainer'>
          <h3>Join a chat</h3>
          <input maxLength='8' type='text' placeholder='user name' onChange={(e) => { setUserName(e.target.value) }} />
          <input maxLength='8' type='text' placeholder='Room Id' onChange={(e) => { setRoom(e.target.value) }} />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
        :
        <Chat updateRoom={updateRoom} setRoom={setRoom} joinRoom={joinRoom} setUserList={setUserList} setRoomList={setRoomList} userList={userList} roomList={roomList} socket={socket} userName={userName} room={room}></Chat>}
    </div>
  )
}

export default App;