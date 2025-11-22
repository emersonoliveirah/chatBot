import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { sendMessage } from '../services/api';
import './Chat.css';

function Chat() {
  const { activeUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Limpa as mensagens quando o usuário ativo muda
  useEffect(() => {
    setMessages([]);
    setMessage('');
  }, [activeUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await sendMessage(activeUser, message);
      
      // Adiciona a mensagem do usuário e a resposta do bot ao estado
      setMessages(prev => [
        {
          id: response.id,
          user_message: response.user_message,
          bot_response: response.bot_response,
          created_at: response.created_at,
        },
        ...prev
      ]);
      
      setMessage('');
    } catch (error) {
      alert('Erro ao enviar mensagem. Por favor, tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Chat">
      <div className="Chat-container">
        <h2>Chat - Usuário {activeUser}</h2>
        
        <div className="Chat-messages">
          {messages.length === 0 ? (
            <div className="Chat-empty">
              <p>Nenhuma mensagem ainda. Envie uma mensagem para começar!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="Chat-message-group">
                <div className="Chat-message user-message">
                  <div className="message-header">
                    <strong>Você (Usuário {activeUser})</strong>
                    <span className="message-time">
                      {new Date(msg.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="message-content">{msg.user_message}</div>
                </div>
                <div className="Chat-message bot-message">
                  <div className="message-header">
                    <strong>Bot</strong>
                  </div>
                  <div className="message-content">{msg.bot_response}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <form className="Chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="Chat-input"
          />
          <button 
            type="submit" 
            disabled={loading || !message.trim()}
            className="Chat-button"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;

