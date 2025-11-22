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

  const groupMessages = (messages) => {
    if (messages.length === 0) return [];
    
    // Agrupa mensagens por session_id
    const groupsMap = {};
    
    messages.forEach(msg => {
      const sessionId = msg.session_id || `no-session-${msg.id}`;
      if (!groupsMap[sessionId]) {
        groupsMap[sessionId] = [];
      }
      groupsMap[sessionId].push(msg);
    });
    
    // Para mensagens sem session_id, agrupa por tempo (5 minutos)
    const finalGroups = [];
    Object.keys(groupsMap).forEach(sessionId => {
      const groupMessages = groupsMap[sessionId];
      
      // Se não tem session_id real, agrupa por tempo
      if (sessionId.startsWith('no-session-')) {
        const timeGroups = [];
        let currentTimeGroup = [groupMessages[0]];
        
        for (let i = 1; i < groupMessages.length; i++) {
          const prevTime = new Date(groupMessages[i - 1].created_at).getTime();
          const currentTime = new Date(groupMessages[i].created_at).getTime();
          const timeDiff = (currentTime - prevTime) / 1000 / 60; // diferença em minutos
          
          if (timeDiff < 5) {
            currentTimeGroup.push(groupMessages[i]);
          } else {
            timeGroups.push(currentTimeGroup);
            currentTimeGroup = [groupMessages[i]];
          }
        }
        
        if (currentTimeGroup.length > 0) {
          timeGroups.push(currentTimeGroup);
        }
        
        finalGroups.push(...timeGroups);
      } else {
        // Mensagens com session_id real
        finalGroups.push(groupMessages);
      }
    });
    
    // Ordena por data da primeira mensagem (mais recente primeiro)
    finalGroups.sort((a, b) => {
      const timeA = new Date(a[0].created_at).getTime();
      const timeB = new Date(b[0].created_at).getTime();
      return timeB - timeA;
    });
    
    return finalGroups;
  };

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
            {groupMessages(messages).map((group, groupIndex) => (
              <div key={`group-${groupIndex}`} className="History-item">
                <div className="History-item-header">
                  <span className="History-date">
                    {new Date(group[0].created_at).toLocaleString('pt-BR')}
                    {group.length > 1 && (
                      <span className="History-group-count"> • {group.length} mensagens</span>
                    )}
                  </span>
                </div>
                <div className="History-message-group">
                  {group.map((msg, msgIndex) => (
                    <React.Fragment key={msg.id}>
                      <div className="History-message user-message">
                        <div className="message-label">Você:</div>
                        <div className="message-text">{msg.user_message}</div>
                        {msgIndex < group.length - 1 && (
                          <div className="message-time-small">
                            {new Date(msg.created_at).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        )}
                      </div>
                      <div className="History-message bot-message">
                        <div className="message-label">Bot:</div>
                        <div className="message-text">{msg.bot_response}</div>
                      </div>
                    </React.Fragment>
                  ))}
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

