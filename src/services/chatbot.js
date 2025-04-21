










export const createChatBot = async ({name,context,token}) => {
    const response = await fetch('/api/chatbot/create', {
        method: "POST",
        body: JSON.stringify({name,context}),
        headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
    if (!response.ok){
        const {err} = await response.json();
        console.log(err);
        throw new Error(err || "Error creating chatbot")
    }
    return response;
}