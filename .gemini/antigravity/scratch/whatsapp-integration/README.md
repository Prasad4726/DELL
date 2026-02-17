# WhatsApp Integration Platform

A full-stack WhatsApp integration platform for managing client-customer interactions, built with Twilio WhatsApp API, Node.js/Express, MongoDB, and React.

## 🌟 Features

### Core Functionality
- **Two-Way Messaging**: Send and receive WhatsApp messages in real-time
- **Form Builder**: Create and send custom forms to customers via WhatsApp
- **File Sharing**: Upload and send images, documents, and other media
- **Real-Time Updates**: Socket.IO integration for instant message delivery
- **Agent Authentication**: Secure JWT-based login system
- **Conversation Management**: Track, filter, and organize customer conversations
- **Customer Profiles**: View customer information and conversation history

### Dashboard Features
- Modern, premium dark theme UI
- Real-time chat interface with message status tracking
- Conversation list with search and filtering
- Customer information panel
- Form management interface
- File upload support
- Responsive design

## 🏗️ Architecture

```
whatsapp-integration/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database and Twilio configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth and error handling
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── server.js           # Entry point
│
└── frontend/               # React dashboard
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── contexts/       # React contexts (Auth)
    │   ├── pages/          # Page components
    │   ├── services/       # API and Socket clients
    │   └── App.jsx         # Main app component
    └── index.html
```

## 📋 Prerequisites

- **Node.js** v16 or higher
- **MongoDB** (local or Atlas)
- **Twilio Account** with WhatsApp API access
- **ngrok** (for local webhook testing)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to project directory
cd whatsapp-integration

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```bash
# Copy example file
cp .env.example .env

# Edit with your credentials
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-integration

TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```bash
# Copy example file
cp .env.example .env

# Verify URLs (should work by default)
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Set Up Twilio WhatsApp Sandbox

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Follow instructions to join the sandbox (send a code to the sandbox number)
4. Note your **WhatsApp Sandbox Number**

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - ngrok (for Twilio webhooks):**
```bash
ngrok http 5000
```

### 5. Configure Twilio Webhooks

1. Copy the ngrok HTTPS URL (e.g., `https://abc123.ngrok.io`)
2. In Twilio Console, go to **Messaging** → **Settings** → **WhatsApp Sandbox Settings**
3. Set webhook URLs:
   - **When a message comes in**: `https://abc123.ngrok.io/api/webhook/whatsapp`
   - **Status callback URL**: `https://abc123.ngrok.io/api/webhook/status`
4. Save configuration

### 6. Create First Agent Account

```bash
# Use API to create agent account
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin Agent",
    "role": "admin"
  }'
```

### 7. Access Dashboard

1. Open browser to `http://localhost:5173`
2. Login with the credentials you created
3. Start chatting!

## 📱 Usage Guide

### Receiving Messages

When a customer sends a WhatsApp message to your Twilio number:
1. The webhook receives the message
2. A new conversation is automatically created (or updated)
3. The message appears in real-time on the dashboard
4. Agents can respond immediately

### Sending Messages

1. Select a conversation from the list
2. Type your message in the input field
3. Click send or press Enter
4. Message is sent via Twilio WhatsApp API

### Sending Forms

1. Click "Form Manager" in the sidebar
2. Create a new form with custom fields
3. Return to dashboard and select a conversation
4. Click "Send Form" in the customer panel
5. Select the form to send
6. Customer receives formatted form via WhatsApp

### File Sharing

1. In the chat window, click the paperclip icon
2. Select an image or document
3. File is uploaded and sent to customer

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new agent
- `POST /api/auth/login` - Agent login
- `GET /api/auth/me` - Get current agent

### Conversations
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id` - Get conversation details
- `PATCH /api/conversations/:id` - Update conversation
- `GET /api/conversations/stats` - Get statistics

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/:conversationId` - Get messages
- `POST /api/messages/upload` - Upload media file

### Forms
- `GET /api/forms` - List forms
- `POST /api/forms` - Create form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `POST /api/forms/:id/send` - Send form to customer

### Webhooks (Public)
- `POST /api/webhook/whatsapp` - Receive WhatsApp messages
- `POST /api/webhook/status` - Receive message status updates

## 🎨 Technology Stack

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- Twilio WhatsApp API
- Socket.IO for real-time
- JWT for authentication
- Multer for file uploads

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Socket.IO Client
- Framer Motion for animations
- React Icons
- date-fns for date formatting

## 🔒 Security Notes

- JWT tokens are stored in localStorage
- All API routes (except webhooks and auth) require authentication
- Passwords are hashed with bcryptjs
- Environment variables for sensitive data
- CORS configured for secure cross-origin requests

## 🐛 Troubleshooting

**Messages not appearing:**
- Check ngrok is running and webhook URL is configured
- Verify Twilio credentials are correct
- Check backend console for errors

**Can't login:**
- Verify agent account was created
- Check MongoDB is running
- Ensure JWT_SECRET is set in .env

**Real-time not working:**
- Check Socket.IO connection in browser console
- Verify SOCKET_CORS_ORIGIN matches frontend URL
- Restart both servers

**Form not sending:**
- Ensure form is marked as "Active"
- Check Twilio account has sufficient balance
- Verify customer phone number format

## 📝 License

MIT License - feel free to use for personal and commercial projects.

## 🤝 Contributing

Contributions welcome! Feel free to submit PRs or open issues.

## 📧 Support

For issues with Twilio integration, consult the [Twilio Docs](https://www.twilio.com/docs/whatsapp).

---

**Built with ❤️ using Twilio WhatsApp API**
