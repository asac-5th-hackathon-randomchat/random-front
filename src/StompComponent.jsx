import React, { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'

function StompComponent({ chatRoomId, username }) {
  const stompClient = useRef(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = event => {
    setInputValue(event.target.value)
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
    <div>
      <ul>
        <div>
          {/* Input field */}
          <input type='text' value={inputValue} onChange={handleInputChange} />
          {/* Send message */}
          <button onClick={sendMessage}>입력</button>
        </div>
        {/* Message list */}
        {messages.map((item, index) => (
          <div key={index}>
            <strong>{item.sender}:</strong> {item.data}
          </div>
        ))}
      </ul>
    </div>
  )
}

export default StompComponent
