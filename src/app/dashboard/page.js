'use client';
import { AuthContext } from '@/context/auth';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createChatBot } from '@/services/chatbot';
import { getToken } from '@/helpers/auth';
import { getChatbots } from '@/services/chatbot';

const Dashboard = () => {
  const globalData = useContext(AuthContext);
  const isLogged = globalData.isLogged;

  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [chatbots, setChatbots] = useState([]);
  const [error, setError] = useState('');

  const router = useRouter()

  const handleAddChatbot = async () => {
    if (name.trim() === '' || context.trim() === '') {
      setError('Both name and context are required.');
      return;
    }

    const newBot = { name, context };
    setChatbots([...chatbots, newBot]);

    await createChatBot({name,context,token: getToken()})


    setName('');
    setContext('');
    setError('');
  };

  useEffect(()=>{
    getChatbots({token: getToken()}).then((res) => {
      setChatbots(res)
    })
},[])

  if (!isLogged) {
    return <>Please Login first</>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Create Chatbot</h2>

      <input
        type='text'
        placeholder='Chatbot name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          display: 'block',
          marginBottom: '1rem',
          padding: '0.5rem',
          width: '300px',
          border: name.trim() === '' && error ? '1px solid red' : '1px solid #ccc'
        }}
      />

      <textarea
        placeholder='Context'
        rows={5}
        value={context}
        onChange={(e) => setContext(e.target.value)}
        style={{
          display: 'block',
          padding: '0.75rem',
          width: '400px',
          marginBottom: '1rem',
          resize: 'vertical',
          border: context.trim() === '' && error ? '1px solid red' : '1px solid #ccc'
        }}
      />

      {error && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
      )}

      <button
        onClick={handleAddChatbot}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        Add Chatbot
      </button>

      <div>
        <h3>Your Chatbots</h3>
        {chatbots.length === 0 && <p>No chatbots yet.</p>}
        {chatbots.map((bot, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <h4>{bot.name}</h4>
            <p>{bot.context}</p>
            <button 
            onClick={()=> router.push(`/chatbot/${bot.name}`)} 
            className='chat-button'
            style={{
              padding: '0.5rem 1.2rem',
              background: 'linear-gradient(to right, #0070f3, #0051a3)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 10px rgba(0, 112, 243, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
            >
              visit
            </button>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Dashboard;
