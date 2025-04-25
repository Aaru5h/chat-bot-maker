'use client'
import React, { useState, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login } from '@/services/auth'
import { AuthContext } from '@/context/auth'

const Login = () => {
  const router = useRouter()
  const { setIsLogged } = useContext(AuthContext)

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const response = await login({ email: form.email, password: form.password })
      const { token } = response
      localStorage.setItem("token", token)

      setIsLogged(true)

      router.push('/dashboard')
    } catch (err) {
      alert(err.message || "Login failed")
      console.error(err)
    }
  }

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Enter your email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Enter your password" onChange={handleChange} />
        <button type="submit">LogIn</button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        If you don't have an account{' '}
        <Link href="/auth/sign-up" style={{ color: 'blue', textDecoration: 'underline' }}>
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default Login
