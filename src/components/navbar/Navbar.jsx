'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'
import { AuthContext } from '@/context/auth';

const Navbar = () => {
  const globalData = useContext(AuthContext);
  const isLogged = globalData.isLogged

  return (
    <div className={styles.navbar}>
      <Link href="/">Home</Link>
      <Link href="/about-us">About</Link>
      <Link href="/dashboard">Dashboard</Link>

      {isLogged ? (
        <button className={styles.logoutButton}>Log Out</button>
      ) : (
        <Link href="/auth/login">
          <button className={styles.logoutButton}>Log In</button>
        </Link>
      )}
    </div>
  )
}

export default Navbar
