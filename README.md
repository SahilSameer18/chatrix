# Chatrix 💬

Chatrix is a premium, real-time messaging web application featuring a sleek glassmorphic user interface. It is built using Node.js, Express, and Socket.io on the backend, and React with Tailwind CSS v4 on the frontend. The application features dummy session login, live online user lists, real-time message broadcasting, typing indicators, and a persistent chat history stored in MongoDB.

---

## 🚀 Features

- **Real-Time Communication**: Seamless chat message delivery without page reloads using Socket.io.
- **Session Authentication**: Fast, username-based login session stored locally to automatically resume on return.
- **Live User Presence**: Sidebar displaying all online users with active indicators that sync and broadcast automatically when users join or disconnect.
- **Typing Indicators**: Visual cues (e.g. *"Alice and Bob are typing..."*) shown when other users are active in the input box.
- **Premium Styling**: Sleek glassmorphic card layout, dark mode aesthetic (`bg-slate-950`), custom scroll bars, and gradient text animations built using Tailwind CSS v4.
- **Persistent History**: Chronological chat history saved in MongoDB and loaded automatically upon login.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` configuration)
- **State Management**: React Context API
- **Real-time Client**: Socket.io Client
- **Icons**: React Icons (Fi icons)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time Server**: Socket.io
- **Database ORM**: Mongoose (MongoDB)
- **Process Manager**: Nodemon

---

## 📁 Project Structure

```
chatrix/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── api/            # API endpoints (Axios calls)
│   │   ├── components/     # UI Views & modular layouts (Sidebar, ChatArea, etc.)
│   │   ├── context/        # ChatContext (global socket, session, and message state)
│   │   ├── socket/         # Socket.io connection setup
│   │   ├── App.jsx         # App router (authenticates and switches screens)
│   │   ├── index.css       # Core stylesheets & Tailwind imports
│   │   └── main.jsx        # Root entry point
│   ├── vite.config.js      # Vite compilation configuration
│   └── package.json
│
├── server/                 # Backend Node.js Server
│   ├── config/             # Database connection setup
│   ├── controllers/        # Express route business logic
│   ├── middleware/         # Custom Express error middlewares
│   ├── models/             # Mongoose schemas (User, Message)
│   ├── routes/             # Express routes (auth and message logs)
│   ├── sockets/            # Socket.io handlers (typing, presence, messages)
│   ├── app.js              # Application bootstrapper
│   ├── package.json
│   └── .env                # Server environment configuration
└── REQUIREMENT.md          # Original requirements document
```

---

## 🏗️ Architecture

```mermaid
flowchart TB
    %% Nodes
    subgraph Client ["Client (React App)"]
        direction TB
        UI["UI View Layer (App.jsx)"]
        Login["Login Screen"]
        Dash["Chat Dashboard"]
        Sidebar["Sidebar (Online list)"]
        ChatArea["Chat Area (History & Input)"]
        
        UI --> Login
        UI --> Dash
        Dash --> Sidebar
        Dash --> ChatArea
        
        subgraph Context ["State Management"]
            CC["ChatContext.jsx (useChat)"]
            SS["socketService.js (Socket.io)"]
            APIs["messages.js (Axios Client)"]
        end
        
        Login & Sidebar & ChatArea <--> CC
        CC <--> SS & APIs
    end

    subgraph Backend ["Backend (Express & Socket.io)"]
        direction TB
        AppJS["app.js (Main Application)"]
        Routes["Express Routes (api/auth, api/messages)"]
        Sockets["Socket.io Handlers (join, disconnect, send_message, typing)"]
        
        AppJS --> Routes
        AppJS --> Sockets
    end

    subgraph Database ["Database Layer"]
        DB["MongoDB (Mongoose ORM)"]
    end

    %% Connections
    APIs <-->|HTTP REST APIs| Routes
    SS <-->|WebSockets (ws://)| Sockets
    Routes <-->|Mongoose Schemas| DB
    Sockets <-->|Mongoose Schemas| DB
    
    %% Styling
    classDef client fill:#4f46e5,stroke:#818cf8,color:#fff;
    classDef server fill:#0f172a,stroke:#334155,color:#fff;
    classDef db fill:#064e3b,stroke:#059669,color:#fff;
    classDef context fill:#1e1b4b,stroke:#4338ca,color:#fff;
    
    class Client,UI,Login,Dash,Sidebar,ChatArea client;
    class Backend,AppJS,Routes,Sockets server;
    class Database,DB db;
    class Context,CC,SS,APIs context;
```

---

## ⚙️ Environment Variables

### Backend Configuration
Create a `.env` file inside the `server/` directory:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/chat-app
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

### Frontend Configuration
By default, the client points to `http://localhost:3000` for both APIs and Sockets. If you change your backend port or deploy to a hosting platform, you can configure these environment variables in a `.env` file inside the `client/` directory:
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

---

## 💻 Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a running instance of [MongoDB](https://www.mongodb.com/) (either locally or on MongoDB Atlas).

---

### Step 1: Run the Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Start the server in development mode (runs on port `3000`):
   ```bash
   npm run dev
   ```

---

### Step 2: Run the Frontend Client
1. Open a new terminal window and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Start the frontend developer server (Vite):
   ```bash
   npm run dev
   ```
4. Click the link shown in your terminal (usually `http://localhost:5173` or `http://localhost:5174`) to launch Chatrix in your browser.

---

## 🧠 Design Decisions & Architecture

1. **Context-Driven State Layer**:
   All state logic (Socket listeners, connection indicators, online users, active session triggers, typing timeouts, and history arrays) is consolidated in `ChatContext.jsx`. This isolates application state from render views, resulting in a cleaner UI layout and easier logic testing.
   
2. **Modular View Component Structure**:
   `App.jsx` acts purely as a shell containing conditional routes (Login vs. Dashboard). Layout grids, sidebars, typing indicators, and individual message boxes are broken out into separate files inside `/client/src/components` to enforce readablity and maintainability.

3. **Robust WebSocket Lifecycle Hook**:
   Socket listener binds are handled inside a single React `useEffect`. When connections drop or the server undergoes hot-reloading:
   - The client automatically re-establishes a connection.
   - The connection listener re-triggers the `'join'` event to register presence with the new server instance immediately.

4. **Multiple Localhost CORS Support**:
   The backend server parses multiple local ports (ports `5173`, `5174`, `5175`) from a comma-separated CORS configuration. This prevents CORS preflight blocks if Vite launches on a fallback port.

---

## 💡 Assumptions Made

- **Session Security**: Username authentication is a dummy login to quickly verify user identity. Password check is assumed out of scope for this design version.
- **Single Room Context**: All users register under the same `#general-chat` channel. Future room creations can be supported by adjusting the `join` socket schema.
- **Local MongoDB Fallback**: The server is pre-configured to look for a local MongoDB instance. If none is found, it will throw a connection error. Please make sure MongoDB is running before launching the server.
