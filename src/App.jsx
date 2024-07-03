import React, { useState } from 'react'
import axios from 'axios'
import StompComponent from './StompComponent'

function App() {
  const [chatRoomId, setChatRoomId] = useState('')
  const [nameInputValue, setNameInputValue] = useState('')
  const [username, setUsername] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleNameInputChange = event => {
    setNameInputValue(event.target.value)
  }

  const handleConnectChannel = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.post(`http://localhost:8080/api/chats/random/${nameInputValue}`)
      setChatRoomId(response.data.chatRoomId)
      setUsername(nameInputValue)
      setIsConnected(true)
      console.log(`Connecting to chat room: ${response.data.chatRoomId} as ${nameInputValue}`)
    } catch (error) {
      console.error('Failed to connect:', error)
      setError('당신과 매칭되는 사람이 없습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnectChannel = () => {
    setChatRoomId('')
    setUsername('')
    setNameInputValue('')
    setIsConnected(false)
    setError('')
    console.log('Disconnected from chat room')
  }

  return (
    <div className='flex items-center justify-center h-[100vh] bg-blue-50 sm:flex p-8'>
      {!isConnected ? (
        <div className='p-6 bg-white rounded-lg shadow-lg m-12 transition-opacity duration-500'>
          {error && <div className='mb-4 text-red-500'>{error}</div>}
          <div className='mb-4'>
            <input
              className='w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              type='text'
              placeholder='이름을 입력하세요'
              value={nameInputValue}
              onChange={handleNameInputChange}
              disabled={isLoading}
            />
          </div>
          <div className='flex space-x-2 justify-center'>
            <button
              className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
              onClick={handleConnectChannel}
              disabled={isLoading}
            >
              {isLoading ? '접속 중...' : '접속'}
            </button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center bg-blue-200 rounded-lg'>
          <StompComponent chatRoomId={chatRoomId} username={username} />
          <button
            className='mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
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
