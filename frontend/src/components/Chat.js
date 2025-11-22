import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { sendMessage } from '../services/api';
import './Chat.css';

function Chat() {
  const { activeUser } = useContext(UserContext);
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef(null);
  const inputRef = useRef(null);

  // Gera um novo session_id quando o componente é montado, usuário muda ou volta para esta tela
  useEffect(() => {
    // Gera um novo session_id único
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setMessages([]);
    setMessage('');
    // Foca no input quando o componente é montado ou usuário muda
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, [activeUser, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await sendMessage(activeUser, message, sessionIdRef.current);
      
      // Adiciona a mensagem do usuário e a resposta do bot ao estado
      setMessages(prev => [
        {
          id: response.id,
          user_message: response.user_message,
          bot_response: response.bot_response,
          created_at: response.created_at,
          session_id: response.session_id,
        },
        ...prev
      ]);
      
      const messageToSend = message;
      setMessage('');
      
      // Mantém o foco no input após enviar (com delay para garantir que o DOM foi atualizado)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    } catch (error) {
      alert('Erro ao enviar mensagem. Por favor, tente novamente.');
      console.error(error);
      // Mantém o foco mesmo em caso de erro
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    } finally {
      setLoading(false);
      // Garante o foco após o loading terminar
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
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
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="Chat-input"
            autoFocus
          />
          <button 
            type="submit" 
            disabled={loading || !message.trim()}
            className="Chat-button"
            onMouseDown={(e) => {
              // Previne que o botão roube o foco do input
              e.preventDefault();
            }}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;

