'use client';
import { AuthContext } from '@/context/auth';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createChatBot } from '@/services/chatbot';
import { getToken } from '@/helpers/auth';
import { getChatbots } from '@/services/chatbot';
import Link from 'next/link';

const Dashboard = () => {
  const globalData = useContext(AuthContext);
  const isLogged = globalData.isLogged;

  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [chatbots, setChatbots] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChatbots, setIsLoadingChatbots] = useState(true);

  const router = useRouter()

  const handleAddChatbot = async () => {
    if (name.trim() === '' || context.trim() === '') {
      setError('Both name and context are required.');
      return;
    }

    setIsLoading(true);
    try {
      await createChatBot({name, context, token: getToken()});
      
      const newBot = { name, context };
      setChatbots([...chatbots, newBot]);
      
      setName('');
      setContext('');
      setError('');
    } catch (err) {
      setError('Failed to create chatbot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLogged) {
      getChatbots({token: getToken()})
        .then((res) => {
          setChatbots(res)
        })
        .catch((err) => {
          console.error('Failed to load chatbots:', err);
        })
        .finally(() => {
          setIsLoadingChatbots(false);
        });
    }
  }, [isLogged])

  if (!isLogged) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#374151' }}>Access Restricted</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Please log in to access your dashboard.</p>
        <Link href="/auth" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '600', color: '#f1f5f9', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
          Dashboard
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
          Create and manage your AI chatbots
        </p>
      </div>

      <div className="grid grid-1" style={{ gap: '3rem' }}>
        {/* Create Chatbot Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Create New Chatbot</h2>
            <p style={{ color: '#6b7280', marginBottom: '0' }}>
              Build a custom AI chatbot with your own context and personality
            </p>
          </div>
          
          <div className="form-group">
            <label className="form-label">Chatbot Name</label>
            <input
              type='text'
              placeholder='Enter a unique name for your chatbot'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`form-input ${name.trim() === '' && error ? 'error-border' : ''}`}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Context & Instructions</label>
            <textarea
              placeholder="Describe your chatbot's personality, knowledge, and how it should respond to users..."
              rows={5}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className={`form-textarea ${context.trim() === '' && error ? 'error-border' : ''}`}
            />
          </div>

          {error && (
            <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>
          )}

          <button
            onClick={handleAddChatbot}
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: 'auto' }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="loading"></div>
                Creating...
              </span>
            ) : (
              'Create Chatbot'
            )}
          </button>
        </div>

        {/* Chatbots List Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Your Chatbots</h2>
            <p style={{ color: '#6b7280', marginBottom: '0' }}>
              {chatbots.length} chatbot{chatbots.length !== 1 ? 's' : ''} created
            </p>
          </div>
          
          {isLoadingChatbots ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="loading" style={{ margin: '0 auto', marginBottom: '1rem' }}></div>
              <p style={{ color: '#6b7280' }}>Loading your chatbots...</p>
            </div>
          ) : chatbots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ color: '#64748b', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <svg className="icon-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>No chatbots yet</h3>
              <p style={{ color: '#94a3b8' }}>Create your first chatbot to get started!</p>
            </div>
          ) : (
            <div className="grid grid-1" style={{ gap: '1.5rem' }}>
              {chatbots.map((bot, index) => (
                <div key={index} style={{
                  padding: '1.5rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '600', 
                      color: '#f1f5f9', 
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      {bot.name}
                    </h3>
                    <p style={{ color: '#94a3b8', lineHeight: '1.5' }}>
                      {bot.context.length > 100 
                        ? bot.context.substring(0, 100) + '...' 
                        : bot.context
                      }
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => router.push(`/chatbot/${bot.name}`)} 
                      className="btn btn-primary"
                    >
                      <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat Now
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/chatbot/${bot.name}`);
                        alert('Link copied to clipboard!');
                      }}
                      className="btn btn-secondary"
                    >
                      <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
