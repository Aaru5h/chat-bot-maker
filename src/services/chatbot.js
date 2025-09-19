export const getChatbots = async ({ token }) => {
  const response = await fetch("/api/chatbot/getByCreator", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const { err } = await response.json();
    console.log(err);
    throw new Error(err || "Error getting chatbot");
  }
  return response.json();
};

export const createChatBot = async ({ name, context, token }) => {
  const response = await fetch("/api/chatbot/create", {
    method: "POST",
    body: JSON.stringify({ name, context }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const { err } = await response.json();
    console.log(err);
    throw new Error(err || "Error creating chatbot");
  }
  return response;
};

export const getAllChatbots = async () => {
  const response = await fetch("/api/chatbot/getAll", {
    method: "GET",
  });
  if (!response.ok) {
    const { err } = await response.json();
    console.log(err);
    throw new Error(err || "Error getting chatbot");
  }
  const x = await response.json();
  return x
};


export const getChatbotByName = async ({ name, token }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`/api/chatbot/getByChatbotName?name=${name}`, {
    method: "GET",
    headers,
  });
  
  if (!response.ok) {
    const { err } = await response.json();
    console.log(err);
    throw new Error(err || "Error getting chatbot");
  }
  return response.json();
};

export const deleteChatbot = async ({ chatbotName, token }) => {
  const response = await fetch("/api/chatbot/delete", {
    method: "DELETE",
    body: JSON.stringify({ chatbotName, token }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error deleting chatbot");
  }
  
  return response.json();
};
