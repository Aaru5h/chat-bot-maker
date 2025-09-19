'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllChatbots } from '@/services/chatbot';

const ExplorePage = () => {
  const [chatbots, setChatbots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    getAllChatbots()
      .then((data) => {
        setChatbots(data);
      })
      .catch((error) => {
        console.error('Failed to load chatbots:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredChatbots = chatbots.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.context.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#1f2937', marginBottom: '1rem' }}>
          🔍 Explore Chatbots
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
          Discover amazing AI chatbots created by our community. Try them out and get inspired!
        </p>
        
        {/* Search Bar */}
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Search chatbots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ textAlign: 'center' }}
          />
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="loading" style={{ margin: '0 auto', marginBottom: '1rem' }}></div>
          <p style={{ color: '#6b7280' }}>Loading amazing chatbots...</p>
        </div>
      ) : filteredChatbots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
          <h3 style={{ color: '#374151', marginBottom: '1rem' }}>
            {searchTerm ? 'No chatbots found' : 'No chatbots available yet'}
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            {searchTerm 
              ? `No chatbots match your search for "${searchTerm}"` 
              : 'Be the first to create a chatbot and share it with the community!'
            }
          </p>
          {!searchTerm && (
            <Link href="/auth" className="btn btn-primary">
              Create First Chatbot
            </Link>
          )}
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: '#6b7280' }}>
              {filteredChatbots.length} chatbot{filteredChatbots.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          <div className="grid grid-2" style={{ gap: '2rem' }}>
            {filteredChatbots.map((bot, index) => (
              <div key={index} className="card" style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                }}
                onClick={() => router.push(`/${bot.name}`)}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🤖</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: '0' }}>
                      {bot.name}
                    </h3>
                  </div>
                  
                  <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
                    {bot.context.length > 120 
                      ? bot.context.substring(0, 120) + '...' 
                      : bot.context
                    }
                  </p>
                  
                  {bot.creator && (
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#9ca3af', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem' 
                    }}>
                      <span>👤</span>
                      Created by {bot.creator}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/${bot.name}`);
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    💬 Try It Out
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(`${window.location.origin}/${bot.name}`);
                      alert('Link copied to clipboard!');
                    }}
                    className="btn btn-secondary"
                  >
                    🔗
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to Action */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '4rem', 
            padding: '3rem', 
            backgroundColor: '#f8fafc', 
            borderRadius: '12px' 
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937' }}>
              Want to Create Your Own?
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Join our community of creators and build your own AI chatbot.
            </p>
            <Link href="/auth" className="btn btn-primary">
              Start Creating
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ExplorePage;
