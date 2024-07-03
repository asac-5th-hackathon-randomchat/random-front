import React, { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'

function StompComponent({ chatRoomId, username }) {
  const stompClient = useRef(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = event => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  const connect = () => {
    const socketUrl = 'ws://localhost:8080/ws'
    stompClient.current = new Client({
      brokerURL: socketUrl,
      connectHeaders: {
        chatRoomId: `${chatRoomId}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.current.subscribe(`/sub/channel/${chatRoomId}`, message => {
          try {
            const newMessage = JSON.parse(message.body)
            setMessages(prevMessages => [...prevMessages, newMessage])
          } catch (error) {
            console.error('Error parsing message body:', error)
          }
        })
      },
      onStompError: error => {
        console.error('Connection error', error)
      },
    })
    stompClient.current.activate()
  }

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.deactivate(() => {
        console.log('Disconnected')
      })
    }
  }

  const sendMessage = () => {
    if (stompClient.current && inputValue) {
      const body = {
        sender: username,
        channelId: chatRoomId,
        data: inputValue,
      }
      stompClient.current.publish({
        destination: `/pub/message`,
        body: JSON.stringify(body),
      })
      setInputValue('')
    }
  }

  useEffect(() => {
    if (chatRoomId) {
      connect()
      // Disconnect when component unmounts
      return () => disconnect()
    }
  }, [chatRoomId])

  return (
    <div className='flex flex-col bg-green-200 rounded-2xl h-[65vh] m-5 '>
      <div className='flex-grow overflow-y-auto p-4'>
        {messages.map((item, index) => (
          <div key={index} className='mb-2 p-2 bg-white rounded-md shadow'>
            <strong className='text-blue-500'>{item.sender}:</strong> {item.data}
          </div>
        ))}
      </div>
      <div className='flex my-4 mx-2'>
        <input
          className='flex-grow p-2 border border-blue-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
          placeholder='메시지를 입력하세요'
        />
        <button
          className='p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          onClick={sendMessage}
        >
          입력
        </button>
      </div>
    </div>
  )
}

export default StompComponent
