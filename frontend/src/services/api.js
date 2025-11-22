import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessage = async (user, message, sessionId) => {
  try {
    const response = await api.post('/messages/', {
      user,
      user_message: message,
      session_id: sessionId,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
};

export const getHistory = async (user) => {
  try {
    const response = await api.get('/history/', {
      params: { user },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
};

