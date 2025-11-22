# Chatbot de Atendimento Simulado

Projeto fullstack desenvolvido para um desafio técnico. Sistema de chat com backend em Django REST Framework e frontend em React.

## 📋 Requisitos Implementados

✅ **Login Mockado**: Sistema simples de seleção de usuário (Usuário A ou Usuário B) no frontend  
✅ **Tela de Chat**: Interface para envio de mensagens com respostas mockadas do backend  
✅ **Tela de Histórico**: Página que exibe o histórico de mensagens filtrado por usuário ativo  

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3+**
- **Django 4.2.7**
- **Django REST Framework 3.14.0**
- **django-cors-headers 4.3.1** (para permitir requisições do frontend)
- **SQLite** (banco de dados padrão do Django)

### Frontend
- **React 18.2.0**
- **React Router DOM 6.20.0** (para navegação entre páginas)
- **Axios 1.6.2** (para requisições HTTP)
- **React Scripts 5.0.1**

## 📁 Estrutura do Projeto

```
chatBot/
├── backend/
│   ├── chatbot_project/      # Configurações do Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   ├── chat/                  # App principal do chat
│   │   ├── models.py          # Model Message
│   │   ├── views.py           # Endpoints da API
│   │   ├── serializers.py    # Serializers para a API
│   │   ├── urls.py           # Rotas da API
│   │   └── admin.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── Chat.js
│   │   │   └── History.js
│   │   ├── context/           # Context API para gerenciar usuário ativo
│   │   │   └── UserContext.js
│   │   ├── services/          # Serviços de API
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- **Python 3.8 ou superior** ([Download](https://www.python.org/downloads/))
- **Node.js 16 ou superior** ([Download](https://nodejs.org/))
- **npm** (vem junto com o Node.js) ou **yarn**
- **Git** ([Download](https://git-scm.com/downloads))

### 1. Clonar o Repositório

```bash
# Windows
Na sua IDE (Cursor/VSCode) utilize o Command Prompt - CMD; ou
Navegue até a pasta na qual deseja clonar o repositório e abra o CMD a partir dela para executar os comandos.

git clone https://github.com/emersonoliveirah/chatBot.git
```


### 2. Configurar o Backend (Django)

#### Passo 1: Navegar até a pasta do backend

```bash
cd chatBot
cd backend
```

#### Passo 2: Criar ambiente virtual

```bash
# Linux/Mac
python3 -m venv venv

# Windows
python -m venv venv
```

#### Passo 3: Ativar o ambiente virtual

```bash
# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

> **Dica:** Quando o ambiente virtual estiver ativo, você verá `(venv)` no início da linha do terminal.

#### Passo 4: Instalar dependências

```bash
pip install -r requirements.txt
```

Isso instalará todas as dependências necessárias:
- Django 4.2.7
- Django REST Framework 3.14.0
- django-cors-headers 4.3.1

#### Passo 5: Executar migrações do banco de dados

```bash
python manage.py migrate
```

Este comando criará as tabelas necessárias no banco de dados SQLite.

#### Passo 6: Iniciar o servidor Django

```bash
python manage.py runserver
```

✅ **Backend rodando!** O servidor estará disponível em `http://localhost:8000`

> **Importante:** Mantenha este terminal aberto. O backend precisa estar rodando para o frontend funcionar.

### 3. Configurar o Frontend (React)

**Abra um NOVO terminal** (mantenha o backend rodando no terminal anterior).

#### Passo 1: Navegar até a pasta do frontend

```bash
cd chatBot
cd frontend
```

#### Passo 2: Instalar dependências

```bash
npm install
```

> **Nota:** Este processo pode levar alguns minutos na primeira vez, pois baixa todas as dependências do React e suas bibliotecas.

#### Passo 3: Iniciar o servidor de desenvolvimento

```bash
npm start
```

✅ **Frontend rodando!** O aplicativo abrirá automaticamente no navegador em `http://localhost:3000`

> **Dica:** Se o navegador não abrir automaticamente, acesse manualmente `http://localhost:3000`

### 4. Acessar a Aplicação

Com ambos os servidores rodando:
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:8000`

A aplicação estará totalmente funcional! 🎉

### ⚠️ Problemas Comuns

#### Backend não inicia
- Verifique se o Python está instalado: `python3 --version` ou `python --version`
- Certifique-se de que o ambiente virtual está ativado (deve aparecer `(venv)` no terminal)
- Verifique se todas as dependências foram instaladas: `pip list`

#### Frontend não inicia
- Verifique se o Node.js está instalado: `node --version`
- Tente limpar o cache: `rm -rf node_modules package-lock.json && npm install`
- Verifique se a porta 3000 está livre

#### Erro de CORS ou conexão com API
- Certifique-se de que o backend está rodando na porta 8000
- Verifique se a URL da API está correta em `frontend/src/services/api.js`
- Abra o console do navegador (F12) para ver erros detalhados

#### Erro ao executar migrações
- Certifique-se de estar na pasta `backend`
- Verifique se o ambiente virtual está ativado
- Tente deletar `db.sqlite3` e executar `python manage.py migrate` novamente

## 📝 Decisões Técnicas

### Backend (Django)

#### Modelagem de Dados

Criei um único model `Message` que armazena:
- `user`: CharField com escolhas ('A' ou 'B') para identificar o usuário
- `user_message`: TextField para a mensagem enviada pelo usuário
- `bot_response`: TextField para a resposta mockada do sistema
- `created_at`: DateTimeField automático para timestamp

**Decisão**: Optei por um model simples e direto, já que não há necessidade de relacionamentos complexos. O campo `user` como CharField com choices é suficiente para identificar o usuário, e todas as informações necessárias (pergunta e resposta) ficam em um único registro.

#### API REST

Implementei dois endpoints:
- `POST /api/messages/`: Recebe `user` e `user_message`, salva no banco e retorna a mensagem completa com a resposta mockada
- `GET /api/history/?user=A`: Retorna todas as mensagens do usuário especificado, ordenadas por data (mais recentes primeiro)

**Decisão**: Usei Django REST Framework por ser a forma padrão e eficiente de criar APIs RESTful com Django. Os serializers garantem validação dos dados e os endpoints são simples e diretos.

#### Respostas Mockadas

As respostas são geradas pela função `get_bot_response()`, que retorna mensagens diferentes para cada usuário:
- Usuário A: "Obrigado por seu contato, Usuário A. Em breve responderemos."
- Usuário B: "Obrigado por seu contato, Usuário B. Nossa equipe entrará em contato em breve."

### Frontend (React)

#### Gerenciamento de Estado

Utilizei **Context API** do React para gerenciar o usuário ativo (`activeUser`). O `UserContext` é fornecido no componente raiz (`App.js`) e pode ser acessado por qualquer componente filho.

**Decisão**: Context API é suficiente para este caso, já que o estado é simples (apenas o usuário ativo) e não há necessidade de gerenciamento de estado complexo. Evitei usar Redux ou outras bibliotecas para manter o projeto simples e direto.

#### Roteamento

Usei **React Router DOM** para criar duas rotas:
- `/`: Tela de Chat
- `/historico`: Tela de Histórico

**Decisão**: React Router é a biblioteca padrão para roteamento em React e permite uma navegação fluida entre as páginas.

#### Componentes

- **Chat.js**: Gerencia o estado local das mensagens enviadas na sessão atual e faz requisições para enviar novas mensagens
- **History.js**: Busca e exibe o histórico completo do usuário ativo, atualizando automaticamente quando o usuário muda

**Decisão**: Separei as responsabilidades em componentes distintos para manter o código organizado e reutilizável.

#### Comunicação com a API

Criei um módulo `services/api.js` que centraliza todas as chamadas à API usando Axios.

**Decisão**: Centralizar as chamadas de API facilita a manutenção e permite reutilização do código. Axios é uma biblioteca popular e confiável para requisições HTTP.

## 🧪 Testando o Sistema

Após seguir todos os passos de instalação e ter ambos os servidores rodando:

### 1. Teste o Login Mockado
- No header da aplicação, clique em "Usuário A" ou "Usuário B"
- O botão ativo ficará destacado em azul

### 2. Teste o Chat
- Na página inicial (Chat), digite uma mensagem no campo de texto
- Clique em "Enviar" ou pressione Enter
- Você verá sua mensagem aparecer à direita (azul claro)
- A resposta do bot aparecerá logo abaixo à esquerda (cinza claro)
- Cada mensagem terá um timestamp

### 3. Teste o Histórico
- Clique em "Histórico" no menu de navegação (barra azul)
- Você verá todas as mensagens do usuário atualmente selecionado
- As mensagens estarão organizadas por data (mais recentes primeiro)
- Troque o usuário ativo (A ↔ B) e veja o histórico atualizar automaticamente
- Use o botão "Atualizar" para recarregar o histórico manualmente

### 4. Teste a Persistência
- Envie algumas mensagens como "Usuário A"
- Troque para "Usuário B" e envie outras mensagens
- Volte para "Usuário A" e verifique se o histórico está correto
- Cada usuário deve ter seu próprio histórico isolado

---

Desenvolvido para o desafio técnico🚀
