'use client'
import React, { useEffect, useState } from 'react'
import { getAllChatbots } from '@/services/chatbot'

const ExplorePage = () => {
  const [chatbots, setChatbots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const bots = await getAllChatbots()
        setChatbots(bots)
      } catch (err) {
        console.error("Failed to fetch chatbots:", err)
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchChatbots()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Explore ChatBots</h1>
      {chatbots.length === 0 ? (
        <p>No chatbots found</p>
      ) : (
        <ul>
          {chatbots.map((bot, i) => (
            <li key={i}>
              <h3>{bot.name}</h3>
              <p>{bot.context}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ExplorePage
