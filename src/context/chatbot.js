'use client'

import { createContext, useState } from "react"

export const ChatbotContext = createContext(null);

const ChatbotProvider = ({children}) => {
    const [chatbots, setChatbots] = useState([])

    return(
        <div>
            hk
        </div>
    )
}