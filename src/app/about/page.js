'use client';
import React from 'react';
import Link from 'next/link';

const About = () => {
  const features = [
    {
      title: "AI-Powered Conversations",
      description: "Leverage Google's Gemini AI to create intelligent chatbots that understand context and provide meaningful responses.",
      icon: "🧠"
    },
    {
      title: "Custom Training",
      description: "Train your chatbots with custom contexts, knowledge bases, and personalities to match your specific needs.",
      icon: "📚"
    },
    {
      title: "Easy Deployment",
      description: "Share your chatbots instantly with unique URLs. No complex setup or hosting required.",
      icon: "🚀"
    },
    {
      title: "User-Friendly Interface",
      description: "Build chatbots without any programming knowledge. Our intuitive interface makes it accessible to everyone.",
      icon: "✨"
    }
  ];

  const techStack = [
    "Next.js 15",
    "React 19",
    "Google Gemini AI",
    "JSON File Storage",
    "JWT Authentication",
    "Modern CSS"
  ];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#1f2937', marginBottom: '1rem' }}>
          About ChatBot Maker
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          ChatBot Maker is a powerful, user-friendly platform that enables anyone to create intelligent AI chatbots
          without any technical expertise. Built with modern web technologies and powered by Google&apos;s Gemini AI.
        </p>
      </div>

      {/* Features Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '3rem', color: '#1f2937' }}>
          Key Features
        </h2>
        <div className="grid grid-2">
          {features.map((feature, index) => (
            <div key={index} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '3rem', color: '#1f2937' }}>
          How It Works
        </h2>
        <div className="grid grid-3">
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '0 auto 1rem'
            }}>
              1
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Create Account
            </h3>
            <p style={{ color: '#6b7280' }}>
              Sign up for free and access your personalized dashboard.
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '0 auto 1rem'
            }}>
              2
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Define Context
            </h3>
            <p style={{ color: '#6b7280' }}>
              Provide your chatbot with knowledge and personality through custom context.
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '0 auto 1rem'
            }}>
              3
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Deploy & Share
            </h3>
            <p style={{ color: '#6b7280' }}>
              Instantly deploy your chatbot and share it with a unique URL.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>
            Built With Modern Technology
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            {techStack.map((tech, index) => (
              <span key={index} style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f8fafc',
                border: '2px solid #e5e7eb',
                borderRadius: '25px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937' }}>
          Ready to Get Started?
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
          Create your first AI chatbot in minutes. No credit card required.
        </p>
        <Link href="/auth" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
          Start Building Now
        </Link>
      </section>
    </div>
  );
};

export default About;
