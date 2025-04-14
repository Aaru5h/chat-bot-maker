'use client'
import React, { useState } from 'react'
import Link from 'next/link' // import Link for navigation

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  function handleChange(e) {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setForm({
      ...form,
      [fieldName]: fieldValue,
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div>
      <h1>Signup Page</h1>
      <form onChange={handleChange} onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Enter your email" />
        <input name="password" type="password" placeholder="Enter your password" />
        <button type="submit">SignUp</button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        If you already have an account,{' '}
        <Link  href="/auth/login" style={{ color: 'blue', textDecoration: 'underline' }}>
          Login
        </Link>
      </p>
    </div>
  )
}

export default SignUp
