'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/auth'
import { logout } from '@/services/auth' 
import { getToken } from '@/helpers/auth'

const Navbar = () => {
  const router = useRouter()
  const { isLogged, setIsLogged } = useContext(AuthContext)

  const handleLogout = async () => {
    try {
      const token = getToken()
      await logout({ token })
      setIsLogged(false)
      router.push('/')
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  }

  const logoStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #e2e8f0 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textDecoration: 'none',
    letterSpacing: '-0.025em'
  }

  const navLinksStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  }

  const linkStyle = {
    textDecoration: 'none',
    color: '#cbd5e1',
    fontWeight: '500',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '0.95rem'
  }

  return (
    <nav style={navStyle}>
      <Link href="/" style={logoStyle}>
        ChatBot Maker
      </Link>
      
      <div style={navLinksStyle}>
        <Link href="/" style={linkStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(71, 85, 105, 0.3)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
        
        {isLogged && (
          <Link href="/dashboard" style={linkStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(71, 85, 105, 0.3)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard
          </Link>
        )}
        
        <Link href="/explore" style={linkStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(71, 85, 105, 0.3)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Explore
        </Link>
        
        <Link href="/about" style={linkStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(71, 85, 105, 0.3)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          About
        </Link>

        {isLogged ? (
          <button onClick={handleLogout} className="btn btn-danger" style={{ marginLeft: '1rem' }}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        ) : (
          <Link href="/auth" className="btn btn-primary" style={{ marginLeft: '1rem' }}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
