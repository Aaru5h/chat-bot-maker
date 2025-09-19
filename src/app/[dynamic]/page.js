'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { askGemini } from '@/services/ai'
import { getChatbotByName } from '@/services/chatbot'

const ChatbotPage = () => {
  const params = useParams()
  const chatbotName = params.dynamic
  
  const [chatbot, setChatbot] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingChatbot, setIsLoadingChatbot] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (chatbotName) {
      getChatbotByName({ name: chatbotName })
        .then((data) => {
          setChatbot(data)
          setMessages([
            {
              type: 'bot',
              content: `Hello! I'm ${data.name}. How can I help you today?`,
              timestamp: new Date().toLocaleTimeString()
            }
          ])
        })
        .catch((error) => {
          console.error('Failed to load chatbot:', error)
        })
        .finally(() => {
          setIsLoadingChatbot(false)
        })
    }
  }, [chatbotName])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !chatbot) return

    const userMessage = {
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await askGemini({
        text: inputMessage.trim(),
        context: chatbot.context
      })
      
      const responseData = await response.json()
      
      const botMessage = {
        type: 'bot',
        content: responseData.message || 'I&apos;m sorry, I couldn&apos;t process that request.',
        timestamp: new Date().toLocaleTimeString()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage = {
        type: 'bot',
        content: 'I&apos;m experiencing some technical difficulties. Please try again later.',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isLoadingChatbot) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <div className="loading" style={{ margin: '2rem auto' }}></div>
        <p style={{ color: '#6b7280' }}>Loading chatbot...</p>
      </div>
    )
  }

  if (!chatbot) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#374151', marginBottom: '1rem' }}>Chatbot Not Found</h2>
        <p style={{ color: '#6b7280' }}>The chatbot &quot;{chatbotName}&quot; doesn&apos;t exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          🤖 {chatbot.name}
        </h1>
        <p style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
          {chatbot.context.length > 150 
            ? chatbot.context.substring(0, 150) + '...' 
            : chatbot.context
          }
        </p>
      </div>

      <div className="chat-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.type}`}>
              <div className="chat-message-content">
                {message.content}
                <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-message bot">
              <div className="chat-message-content" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="loading" style={{ width: '16px', height: '16px' }}></div>
                Thinking...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="chat-input"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="chat-send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatbotPage
