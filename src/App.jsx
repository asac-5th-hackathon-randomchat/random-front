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
    <div className='flex items-center justify-center bg-blue-50 h-full w-full'>
      <div className='p-6 bg-white rounded-lg shadow-lg m-12'>
        <div className='mb-4'>
          <input
            className='w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            type='text'
            placeholder='이름을 입력하세요'
            value={nameInputValue}
            onChange={handleNameInputChange}
          />
        </div>
        <div className='mb-4'>
          <input
            className='w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            type='text'
            placeholder='채팅방 ID를 입력하세요'
            value={roomInputValue}
            onChange={handleRoomInputChange}
          />
        </div>
        <div className='flex space-x-2'>
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onClick={handlerConnectChannel}
          >
            접속
          </button>
          <button
            className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
            onClick={handlerDisconnectChannel}
          >
            해체
          </button>
        </div>
      </div>
      <div>
        {chatRoomId === '' ? null : <StompComponent chatRoomId={chatRoomId} username={username} />}
      </div>
    </div>
  )
}

export default App
