import './App.css'
import React, { useState } from 'react'
import StompComponent from './StompComponent'

function App() {
  const [chatRoomId, setChatRoomId] = useState('')
  const [roomInputValue, setRoomInputValue] = useState('')
  const [username, setUsername] = useState('')
  const [nameInputValue, setNameInputValue] = useState('')

  const handleRoomInputChange = event => {
    setRoomInputValue(event.target.value)
  }

  const handleNameInputChange = event => {
    setNameInputValue(event.target.value)
  }

  const handlerConnectChannel = () => {
    setChatRoomId(roomInputValue)
    setUsername(nameInputValue)
    console.log(`Connecting to chat room: ${roomInputValue} as ${nameInputValue}`)
  }

  const handlerDisconnectChannel = () => {
    setChatRoomId('')
    setRoomInputValue('')
    setUsername('')
    setNameInputValue('')
    console.log('Disconnected from chat room')
  }

  return (
    <div>
      <div>
        <input
          type='text'
          placeholder='이름을 입력하세요'
          value={nameInputValue}
          onChange={handleNameInputChange}
        />
      </div>
      <div>
        <input
          type='text'
          placeholder='채팅방 ID를 입력하세요'
          value={roomInputValue}
          onChange={handleRoomInputChange}
        />
      </div>
      <div>
        <button onClick={handlerConnectChannel}>접속</button>
        <button onClick={handlerDisconnectChannel}>해체</button>
      </div>
      {chatRoomId === '' ? null : <StompComponent chatRoomId={chatRoomId} username={username} />}
    </div>
  )
}

export default App
