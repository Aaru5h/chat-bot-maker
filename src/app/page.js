'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/context/auth';

export default function Home() {
  const { isLogged } = useContext(AuthContext);

  const features = [
    {
      title: "Easy to Use",
      description: "Create chatbots with a simple, intuitive interface. No coding required!",
      icon: (
        <svg className="icon-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "AI Powered",
      description: "Leverage advanced AI technology to create intelligent, context-aware chatbots.",
      icon: (
        <svg className="icon-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Customizable",
      description: "Train your chatbots with custom contexts and personalities for any use case.",
      icon: (
        <svg className="icon-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      )
    },
    {
      title: "Deploy Anywhere",
      description: "Share your chatbots with unique links and embed them anywhere you need.",
      icon: (
        <svg className="icon-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Build Powerful AI Chatbots</h1>
          <p className="hero-subtitle">
            Create, customize, and deploy intelligent chatbots in minutes. 
            No technical skills required.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isLogged ? (
              <Link href="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth" className="btn btn-primary">
                  Get Started Free
                </Link>
                <Link href="/explore" className="btn btn-secondary">
                  Explore Chatbots
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '600', marginBottom: '3rem', color: '#f1f5f9', letterSpacing: '-0.025em' }}>
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-2">
            {features.map((feature, index) => (
              <div key={index} className="card" style={{ textAlign: 'center' }}>
                <div style={{ color: '#3b82f6', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#f1f5f9' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', color: '#f1f5f9' }}>
              Ready to Get Started?
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#94a3b8', marginBottom: '2rem' }}>
              Join thousands of users who are already creating amazing chatbots.
            </p>
            {!isLogged && (
              <Link href="/auth" className="btn btn-primary">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Chatbot
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
