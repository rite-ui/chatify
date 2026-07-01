# ⚡ ChatApp — Full-Stack Real-Time Chat with AI

A production-grade MERN stack chat application with real-time messaging via Socket.IO, AI-powered features using Claude, email authentication, dark/light mode, and a premium Tailwind CSS UI.

---

## 🗂 Project Structure

```
chat-app/
├── backend/          # Node.js + Express + Socket.IO
│   ├── config/       # DB connection
│   ├── controllers/  # Auth, Chat, AI controllers
│   ├── middleware/   # JWT auth, error handling
│   ├── models/       # Mongoose models (User, Message, Conversation)
│   ├── routes/       # Express routes
│   ├── socket/       # Socket.IO event handlers
│   ├── utils/        # JWT helpers, Email sender
│   └── server.js     # Entry point
│
└── frontend/         # React + Vite + Tailwind CSS
    └── src/
        ├── components/
        │   ├── auth/   # ProtectedRoute
        │   ├── chat/   # MessageBubble, MessageInput, ChatWindow, etc.
        │   ├── layout/ # Sidebar, ProfileModal
        │   └── ui/     # Avatar, Input, Modal (reusable)
        ├── context/    # Zustand stores (auth, chat, theme)
        ├── hooks/      # useSocket, useTyping
        ├── pages/      # Login, Register, Chat, ForgotPassword, etc.
        ├── services/   # Axios API, Socket.IO client
        └── styles/     # Tailwind globals
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- MongoDB (local or Atlas)
- Gemni API key (for AI features)
- Gmail / SMTP credentials (for emails)

---

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# → Fill in your values in .env
npm run dev
```

#### Required `.env` values:
```
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=you@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
gemini_API_KEY=sk-ant-...
```

> **Gmail tip:** Use an [App Password](https://myaccount.google.com/apppasswords), not your regular Gmail password.

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Auth | Register, Login, Logout, Email Verification, Forgot/Reset Password |
| 💬 Real-time Chat | WebSocket messaging via Socket.IO |
| 👥 Conversations | Direct messages & Group chats |
| 🤖 AI Assistant | In-chat AI powered by Claude (Anthropic) |
| ✨ Smart Replies | AI-suggested reply options |
| 📝 AI Summarize | Summarize any conversation with one click |
| 😀 Reactions | Emoji reactions on messages |
| ↩️ Reply | Threaded reply to specific messages |
| ✏️ Edit / Delete | Edit and delete your own messages |
| 📖 Read Receipts | Single/double tick + blue read indicator |
| ⌨️ Typing Indicator | Live typing dots |
| 🌓 Dark / Light Mode | System-aware, persisted in localStorage |
| 👤 Profile | Update avatar, username, bio |
| 🔍 User Search | Find users to chat with |

---

## 🛠 Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT, Bcrypt, Nodemailer  
**Frontend:** React 19, Vite, Tailwind CSS, Zustand, Framer Motion, Socket.IO Client, Axios, React Router v7  
**AI:** gemni API  
**Email:** Nodemailer (SMTP)

---

## 📡 API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/verify-email/:token` | Verify email |
| POST | `/api/auth/forgot-password` | Request reset |
| POST | `/api/auth/reset-password/:token` | Reset password |
| PUT | `/api/auth/update-profile` | Update profile |

### Chat
| Method | Route | Description |
|---|---|---|
| GET | `/api/conversations` | List conversations |
| POST | `/api/conversations/direct` | Start/get DM |
| POST | `/api/conversations/group` | Create group |
| GET | `/api/messages/:id` | Get messages |
| DELETE | `/api/messages/:id` | Delete message |
| GET | `/api/users/search?q=` | Search users |

### AI
| Method | Route | Description |
|---|---|---|
| POST | `/api/ai/chat` | Send AI prompt |
| GET | `/api/ai/summarize/:id` | Summarize chat |
| GET | `/api/ai/suggest-reply/:id` | Smart reply suggestions |

---

## 🔌 Socket Events

| Event | Direction | Payload |
|---|---|---|
| `message:send` | Client → Server | `{ conversationId, content, replyTo? }` |
| `message:new` | Server → Client | Message object |
| `message:updated` | Server → Client | Updated message |
| `message:react` | Client → Server | `{ messageId, emoji, conversationId }` |
| `message:edit` | Client → Server | `{ messageId, content, conversationId }` |
| `typing:start` | Client → Server | `{ conversationId }` |
| `typing:stop` | Client → Server | `{ conversationId }` |
| `message:read` | Client → Server | `{ conversationId }` |
| `user:status` | Server → Client | `{ userId, status }` |
| `users:online` | Server → Client | `string[]` user IDs |
