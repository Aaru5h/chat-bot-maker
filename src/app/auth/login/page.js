'use client'
import React,{useState} from 'react'

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
          <input name = "email" type = "email" placeholder='Enter your email' ></input>
          <input name = "password" type = "password" placeholder='Enter your password' ></input>
          <button type='submit'>LogIn</button>
        </form>
      </div>
    )
  }

export default Login