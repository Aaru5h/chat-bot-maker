"use client"

import { isUserLoggedIn } from "@/helpers/auth";
import { useState, createContext, useEffect } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({children}) =>{
    const [isLogged,setIsLogged] = useState(false)

    useEffect(()=>{
        setIsLogged(isUserLoggedIn())
    },[])

    return(
        <AuthContext.Provider value={{isLogged, setIsLogged}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider