export const register = async ({email, password, name}) => {
    const response = await fetch("/api/auth/signup", {
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({email, password, name}),
        method: "POST"
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }
    
    // Store token if registration successful
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    
    return { success: true, ...data };
}

export const login = async ({email, password}) => {
    const response = await fetch("/api/auth/login", {
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({email, password}),
        method: "POST"
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }
    
    // Store token if login successful
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    
    return { success: true, ...data };
}



export const logout = async ({token}) => {
    try {
        const response = await fetch(`/api/auth/logout`, {
            method: "POST",
            body: JSON.stringify({token}),
            headers: {
                "Content-Type": "application/json",
            }
        })

        if(!response.ok){
            const {err} = await response.json()
            console.log(err)
            throw new Error(err || "Logout failed")
        }
        
        // Clear token from localStorage regardless of server response
        localStorage.removeItem('token');
        
        return response
    } catch (error) {
        // Even if server request fails, clear local token
        localStorage.removeItem('token');
        throw error;
    }
}
