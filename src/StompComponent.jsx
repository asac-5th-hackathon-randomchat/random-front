import React, { useEffect, useRef, useState } from 'react'
import { Stomp } from '@stomp/stompjs'

function StompComponent({ chatRoomId, username }) {
  const stompClient = useRef(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = event => {
    setInputValue(event.target.value)
  }

  const connect = () => {
    const socket = new WebSocket('ws://localhost:8080/ws')
    stompClient.current = Stomp.over(socket)
    stompClient.current.connect(
      { chatRoomId: chatRoomId },
      frame => {
        console.log('Connected: ' + frame)
        stompClient.current.subscribe(`/sub/channel/${chatRoomId}`, message => {
          try {
            const newMessage = JSON.parse(message.body)
            setMessages(prevMessages => [...prevMessages, newMessage])
          } catch (error) {
            console.error('Error parsing message body:', error)
          }
        })
      },
      error => {
        console.error('Connection error', error)
      },
    )
  }

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect(() => {
        console.log('Disconnected')
      })
    }
  }

  const sendMessage = () => {
    if (stompClient.current && inputValue) {
      const body = {
        sender: username, // 사용자 이름을 여기 입력
        channelId: chatRoomId,
        data: inputValue,
      }
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(body))
      setInputValue('')
    }
  }

  useEffect(() => {
    if (chatRoomId) {
      connect()
      // 컴포넌트 언마운트 시 웹소켓 연결 해제
      return () => disconnect()
    }
  }, [chatRoomId])

  return (
    <div>
      <ul>
        <div>
          {/* 입력 필드 */}
          <input type='text' value={inputValue} onChange={handleInputChange} />
          {/* 메시지 전송 */}
          <button onClick={sendMessage}>입력</button>
        </div>
        {/* 메시지 리스트 출력 */}
        {messages.map((item, index) => (
          <div key={index} className='list-item'>
            <strong>{item.sender}:</strong> {item.data}
          </div>
        ))}
      </ul>
    </div>
  )
}

export default StompComponent
