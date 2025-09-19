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
              content: `Hello! I'm ${data.name}. ${data.context ? 'I\'m here to help based on my training. ' : ''}How can I assist you today?`,
              timestamp: new Date().toLocaleTimeString(),
              id: Date.now()
            }
          ])
        })
        .catch((error) => {
          console.error('Failed to load chatbot:', error)
          setMessages([
            {
              type: 'bot',
              content: 'Sorry, I had trouble loading. Please try refreshing the page.',
              timestamp: new Date().toLocaleTimeString(),
              id: Date.now()
            }
          ])
        })
        .finally(() => {
          setIsLoadingChatbot(false)
        })
    }
  }, [chatbotName])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !chatbot) return

    const userMessageText = inputMessage.trim()
    const userMessage = {
      type: 'user',
      content: userMessageText,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      console.log('Sending message to AI:', { text: userMessageText, context: chatbot.context })
      
      const response = await askGemini({
        text: userMessageText,
        context: chatbot.context
      })
      
      console.log('AI Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const responseData = await response.json()
      console.log('AI Response data:', responseData)
      
      let botContent = 'I&apos;m sorry, I couldn&apos;t process that request.'
      
      if (responseData.message) {
        botContent = responseData.message
      } else if (responseData.response && responseData.response.candidates) {
        // Handle legacy response format
        const candidate = responseData.response.candidates[0]
        if (candidate && candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          botContent = candidate.content.parts[0].text
        }
      }
      
      const botMessage = {
        type: 'bot',
        content: botContent,
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now() + 1
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage = {
        type: 'bot',
        content: `I&apos;m experiencing some technical difficulties. ${error.message.includes('GEMINI_API_KEY') ? 'The AI service needs to be configured.' : 'Please try again later.'}`,
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now() + 2
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
      {/* Chat Header */}
      <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem'
          }}>
            <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '600', color: '#f1f5f9', marginBottom: '0.25rem', letterSpacing: '-0.025em' }}>
              {chatbot.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Online</span>
            </div>
          </div>
        </div>
        <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          {chatbot.context.length > 150 
            ? chatbot.context.substring(0, 150) + '...' 
            : chatbot.context
          }
        </p>
      </div>

      <div className="chat-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#64748b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <svg className="icon-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Start a conversation with {chatbot.name}</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id || message.timestamp} className={`chat-message ${message.type}`}>
                <div className="chat-message-content">
                  <div style={{ marginBottom: '0.5rem' }}>
                    {message.content}
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {message.type === 'user' ? (
                      <svg className="icon" style={{ width: '12px', height: '12px' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="icon" style={{ width: '12px', height: '12px' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7zM3 2a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V2z" clipRule="evenodd" />
                      </svg>
                    )}
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="chat-message bot">
              <div className="chat-message-content" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div>
                  <div style={{ marginBottom: '0.25rem' }}>{chatbot.name} is typing...</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Processing your message</div>
                </div>
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
            placeholder={`Message ${chatbot.name}...`}
            className="chat-input"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="chat-send-btn"
          >
            {isLoading ? (
              <div className="loading" style={{ width: '16px', height: '16px' }}></div>
            ) : (
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div style={{ maxWidth: '900px', margin: '1.5rem auto 0', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          "Hello, how can you help me?",
          "What can you do?",
          "Tell me about yourself"
        ].map((suggestion, index) => (
          <button
            key={index}
            onClick={() => {
              setInputMessage(suggestion)
              // Auto-send after a short delay to show the message was set
              setTimeout(() => {
                if (!isLoading) {
                  setInputMessage(suggestion)
                  // Trigger the send manually
                  const fakeEvent = { target: { value: suggestion } }
                  setInputMessage(suggestion)
                }
              }, 100)
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              background: 'rgba(30, 41, 59, 0.5)',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(12px)'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = '#3b82f6'
              e.target.style.color = '#e2e8f0'
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'rgba(71, 85, 105, 0.3)'
              e.target.style.color = '#94a3b8'
            }}
            disabled={isLoading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChatbotPage
