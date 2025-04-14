'use client'
import React,{useState} from 'react'
import Link from 'next/link' 

const Login = () => {
  const [form,setForm] = useState({
      email: "",
      password: ""
    })
  
  function handleChange(e){
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setForm({
      ...form,
      [fieldName]:fieldValue,
    })
  }

  function handleSubmit(e){
    e.preventDefault()
  }

  return (
    <div>
      <h1>Login Page</h1>
      <form onChange={handleChange} onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Enter your email" />
        <input name="password" type="password" placeholder="Enter your password" />
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
