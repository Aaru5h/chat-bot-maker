"use client"
import { getToken } from '@/helpers/auth'
import { askGemini } from '@/services/ai'
import { getChatbotByName } from '@/services/chatbot'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Page(){
  const params = useParams();
  const [botDetails, setBotDetails] = useState({
    name: "",
    context: "",
  })

  const[text,setText] = useState('')
  const[chat,setChat] = useState([])
  


  function handleChange(e){
    setText(e.target.value)
  }

  async function handleClick(){
    const res = await askGemini({text: text, context: botDetails.context})

    const data = await res.json()
    const gotMesssage = data.response.candidates[0].content.parts[0].text
    console.log(gotMesssage)

    setText('')
  }

  useEffect(()=>{
    console.log(params.dynamicRoute);
    if (!params.dynamicRoute) return;
    const token = getToken()

    getChatbotByName({token, name: params.dynamicRoute}).then((data)=> {
      setBotDetails({...data})
    })
  }, [params.dynamicRoute])




  console.log(params);
  return(
    <div>

      <h1>{params.dynamicRoute}</h1>
      <p>Context: {botDetails.context}</p>
      <input
          type="text"
          placeholder="Type your message"
          onChange={handleChange}
          value={text}
        />
        <button onClick={handleClick}>Send</button>
    </div>
  )
}