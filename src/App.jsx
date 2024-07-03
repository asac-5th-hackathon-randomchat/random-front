import React, { useState } from 'react'
import StompComponent from './StompComponent'

function App() {
  const [chatRoomId, setChatRoomId] = useState('')
  const [roomInputValue, setRoomInputValue] = useState('')
  const [username, setUsername] = useState('')
  const [nameInputValue, setNameInputValue] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  const handleRoomInputChange = event => {
    setRoomInputValue(event.target.value)
  }

  const handleNameInputChange = event => {
    setNameInputValue(event.target.value)
  }

  const handleConnectChannel = () => {
    setChatRoomId(roomInputValue)
    setUsername(nameInputValue)
    setIsConnected(true)
    console.log(`Connecting to chat room: ${roomInputValue} as ${nameInputValue}`)
  }

  const handleDisconnectChannel = () => {
    setChatRoomId('')
    setRoomInputValue('')
    setUsername('')
    setNameInputValue('')
    setIsConnected(false)
    console.log('Disconnected from chat room')
  }

  return (
    <div className='flex items-center justify-center h-[100vh] bg-blue-50 sm:flex p-8'>
      {!isConnected ? (
        <div className='p-6 bg-white rounded-lg shadow-lg m-12 transition-opacity duration-500  '>
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
          <div className='flex space-x-2 justify-center'>
            <button
              className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
              onClick={handleConnectChannel}
            >
              접속
            </button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center bg-blue-200 rounded-lg'>
          <StompComponent chatRoomId={chatRoomId} username={username} />
          <button
            className='mb-4 px-4 py-2  bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
            onClick={handleDisconnectChannel}
          >
            채팅방 나가기
          </button>
        </div>
      )}
    </div>
  )
}

export default App
