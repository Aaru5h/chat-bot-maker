"use client"

import { useState, createContext } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({children}) =>{
    const [isLogged,setIsLogged] = useState(false)

    return(
        <AuthContext.Provider value={{isLogged, setIsLogged}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider