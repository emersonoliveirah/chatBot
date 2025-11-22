import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { getHistory } from '../services/api';
import './History.css';

function History() {
  const { activeUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [activeUser]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getHistory(activeUser);
      setMessages(data);
    } catch (err) {
      setError('Erro ao carregar histórico. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="History">
        <div className="History-container">
          <h2>Histórico - Usuário {activeUser}</h2>
          <div className="History-loading">
            <p>Carregando histórico...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="History">
        <div className="History-container">
          <h2>Histórico - Usuário {activeUser}</h2>
          <div className="History-error">
            <p>{error}</p>
            <button onClick={loadHistory}>Tentar Novamente</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="History">
      <div className="History-container">
        <div className="History-header">
          <h2>Histórico - Usuário {activeUser}</h2>
          <button onClick={loadHistory} className="History-refresh">
            Atualizar
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="History-empty">
            <p>Nenhuma mensagem no histórico para o Usuário {activeUser}.</p>
          </div>
        ) : (
          <div className="History-list">
            {messages.map((msg) => (
              <div key={msg.id} className="History-item">
                <div className="History-item-header">
                  <span className="History-date">
                    {new Date(msg.created_at).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="History-message-group">
                  <div className="History-message user-message">
                    <div className="message-label">Você:</div>
                    <div className="message-text">{msg.user_message}</div>
                  </div>
                  <div className="History-message bot-message">
                    <div className="message-label">Bot:</div>
                    <div className="message-text">{msg.bot_response}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;

