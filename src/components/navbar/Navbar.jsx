'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Navbar.module.css'
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
      router.push('/auth/login')
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  return (
    <div className={styles.navbar}>
      <Link href="/">Home</Link>
      <Link href="/about-us">About</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/explore">Explore</Link>

      {isLogged ? (
        <button onClick={handleLogout} className={styles.logoutButton}>Log Out</button>
      ) : (
        <Link href="/auth/login">
          <button className={styles.logoutButton}>Log In</button>
        </Link>
      )}
    </div>
  )
}

export default Navbar
