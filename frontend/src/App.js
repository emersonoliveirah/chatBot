import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Chat from './components/Chat';
import History from './components/History';
import './App.css';

function App() {
  const [activeUser, setActiveUser] = useState('A');

  return (
    <UserContext.Provider value={{ activeUser, setActiveUser }}>
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="header-left">
              <div className="logo-4blue">
                <span className="logo-number">4</span>
                <span className="logo-text">blue</span>
              </div>
              <h1>Chatbot de Atendimento</h1>
            </div>
            <div className="user-selector">
              <span>Usuário Ativo: </span>
              <button
                className={activeUser === 'A' ? 'active' : ''}
                onClick={() => setActiveUser('A')}
              >
                Usuário A
              </button>
              <button
                className={activeUser === 'B' ? 'active' : ''}
                onClick={() => setActiveUser('B')}
              >
                Usuário B
              </button>
            </div>
          </header>

          <nav className="App-nav">
            <NavLink to="/" end>Chat</NavLink>
            <NavLink to="/historico">Histórico</NavLink>
          </nav>

          <main className="App-main">
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/historico" element={<History />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;

