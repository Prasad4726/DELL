# WhatsApp Integration System with Twilio

Build a full-stack WhatsApp integration platform that enables client-customer interactions through messaging and forms. The system uses Twilio's WhatsApp API for message delivery, Node.js/Express backend with MongoDB for data persistence, and a React-based dashboard for agent management.

## User Review Required

> [!IMPORTANT]
> **Twilio Account Setup Required**
> You'll need to create a Twilio account and set up the WhatsApp Sandbox before testing. The setup instructions will be provided in the documentation.

> [!IMPORTANT]
> **Environment Configuration**
> The system requires several API keys and credentials (Twilio Account SID, Auth Token, MongoDB URI). These will need to be configured in `.env` files.

> [!WARNING]
> **Webhook Public URL**
> Twilio webhooks require a publicly accessible URL. For local development, we'll use ngrok or a similar service. This means you'll need to run an additional tunneling service during development.

## Proposed Changes

### Backend - WhatsApp Integration Service

#### [NEW] [package.json](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/package.json)
Initialize Node.js backend with dependencies: `express`, `mongoose`, `twilio`, `dotenv`, `cors`, `multer` (file uploads), `socket.io` (real-time updates), `jsonwebtoken` (authentication), `bcryptjs` (password hashing).

#### [NEW] [server.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/server.js)
Main server entry point that:
- Configures Express middleware (CORS, JSON parsing, file uploads)
- Connects to MongoDB
- Initializes Socket.IO for real-time communication
- Registers all route handlers
- Starts HTTP server on port 5000

#### [NEW] [config/db.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/config/db.js)
MongoDB connection configuration using Mongoose with connection pooling and error handling.

#### [NEW] [config/twilio.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/config/twilio.js)
Twilio client initialization with Account SID and Auth Token from environment variables.

---

### Backend - Data Models

#### [NEW] [models/Conversation.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/models/Conversation.js)
MongoDB schema for conversations:
- `customerPhone` (customer's WhatsApp number)
- `customerName` (extracted from first message or set by agent)
- `assignedAgent` (reference to Agent model)
- `status` (active, closed, pending)
- `lastMessage` (preview text)
- `lastMessageAt` (timestamp for sorting)
- `tags` (array of labels)

#### [NEW] [models/Message.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/models/Message.js)
MongoDB schema for individual messages:
- `conversationId` (reference to Conversation)
- `from` (sender phone number)
- `to` (recipient phone number)
- `body` (message text)
- `direction` (inbound/outbound)
- `messageType` (text, image, document, form)
- `mediaUrl` (for file attachments)
- `formData` (structured data for form submissions)
- `status` (sent, delivered, read, failed)
- `twilioSid` (Twilio message ID)
- `timestamp`

#### [NEW] [models/Form.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/models/Form.js)
MongoDB schema for form templates:
- `name` (form identifier, e.g., "Lead Capture")
- `description`
- `fields` (array of field definitions with type, label, required, options)
- `isActive` (boolean)
- `createdBy` (reference to Agent)

#### [NEW] [models/Agent.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/models/Agent.js)
MongoDB schema for dashboard agents:
- `email` (unique login)
- `password` (hashed with bcryptjs)
- `name`
- `role` (admin, agent)
- `isActive` (boolean)

---

### Backend - API Routes & Controllers

#### [NEW] [routes/webhook.routes.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/routes/webhook.routes.js)
Webhook endpoints for Twilio:
- `POST /api/webhook/whatsapp` - Receive incoming WhatsApp messages
- `POST /api/webhook/status` - Receive message status updates (delivered, read, failed)

#### [NEW] [controllers/webhook.controller.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/controllers/webhook.controller.js)
Handle incoming WhatsApp messages:
- Parse Twilio webhook payload
- Create or find existing conversation
- Save message to database
- Emit real-time event via Socket.IO
- Process form submissions if message contains form data
- Auto-respond with welcome message for new conversations

#### [NEW] [routes/message.routes.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/routes/message.routes.js)
Message management endpoints (authenticated):
- `POST /api/messages/send` - Send message via Twilio
- `GET /api/messages/:conversationId` - Get conversation history
- `POST /api/messages/upload` - Upload and send media files

#### [NEW] [controllers/message.controller.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/controllers/message.controller.js)
- Send outbound messages using Twilio client
- Handle media uploads (save to local storage or cloud)
- Retrieve paginated message history
- Mark messages as read

#### [NEW] [routes/conversation.routes.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/routes/conversation.routes.js)
Conversation management endpoints (authenticated):
- `GET /api/conversations` - List all conversations with filters
- `GET /api/conversations/:id` - Get conversation details
- `PATCH /api/conversations/:id` - Update conversation (assign agent, add tags, change status)
- `DELETE /api/conversations/:id` - Archive conversation

#### [NEW] [controllers/conversation.controller.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/controllers/conversation.controller.js)
Implement conversation CRUD operations with pagination, filtering, and sorting.

#### [NEW] [routes/form.routes.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/routes/form.routes.js)
Form management endpoints (authenticated):
- `GET /api/forms` - List all forms
- `POST /api/forms` - Create new form template
- `PUT /api/forms/:id` - Update form template
- `DELETE /api/forms/:id` - Delete form
- `POST /api/forms/:id/send` - Send form to customer via WhatsApp

#### [NEW] [controllers/form.controller.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/controllers/form.controller.js)
- Create/edit form templates with dynamic fields
- Generate WhatsApp-friendly form messages
- Parse customer form responses
- Validate submitted form data

#### [NEW] [routes/auth.routes.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/routes/auth.routes.js)
Authentication endpoints:
- `POST /api/auth/register` - Register new agent (admin only)
- `POST /api/auth/login` - Agent login (returns JWT)
- `GET /api/auth/me` - Get current agent info

#### [NEW] [controllers/auth.controller.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/controllers/auth.controller.js)
Implement JWT-based authentication with bcryptjs password hashing.

#### [NEW] [middleware/auth.middleware.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/middleware/auth.middleware.js)
JWT verification middleware to protect authenticated routes.

#### [NEW] [middleware/errorHandler.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/middleware/errorHandler.js)
Global error handler for consistent error responses.

---

### Backend - Services

#### [NEW] [services/whatsapp.service.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/services/whatsapp.service.js)
Core WhatsApp messaging logic:
- `sendTextMessage(to, body)` - Send text via Twilio
- `sendMediaMessage(to, mediaUrl, caption)` - Send image/document
- `sendFormMessage(to, formId)` - Format and send form
- `parseIncomingMessage(twilioPayload)` - Process webhook data

#### [NEW] [services/socket.service.js](file:///C:/Users/DELL/.gemini/antigravity/sketch/whatsapp-integration/backend/services/socket.service.js)
Socket.IO event management:
- Emit new message events to connected dashboard clients
- Emit conversation updates
- Handle agent join/leave events

---

### Frontend - React Dashboard

#### [NEW] [package.json](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/package.json)
Initialize React app with Vite, dependencies: `react`, `react-dom`, `react-router-dom`, `axios`, `socket.io-client`, `@emotion/react`, `@emotion/styled`, `framer-motion`, `react-icons`.

#### [NEW] [src/main.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/main.jsx)
React app entry point with Router setup.

#### [NEW] [src/App.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/App.jsx)
Main app component with routing:
- `/login` - Login page
- `/dashboard` - Main dashboard (protected)
- `/forms` - Form management (protected)

#### [NEW] [src/index.css](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/index.css)
Premium design system with:
- Custom color palette (gradient accent colors, dark mode optimized)
- Typography using Google Fonts (Inter)
- Glassmorphism utilities
- Smooth animations and transitions
- Responsive breakpoints

#### [NEW] [src/contexts/AuthContext.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/contexts/AuthContext.jsx)
Authentication context providing:
- Login/logout functions
- Current agent state
- Token management (localStorage)
- Protected route wrapper

#### [NEW] [src/services/api.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/services/api.js)
Axios instance with interceptors for authentication headers and error handling.

#### [NEW] [src/services/socket.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/services/socket.js)
Socket.IO client connection manager.

---

### Frontend - Components

#### [NEW] [src/pages/Login.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/pages/Login.jsx)
Modern login page with:
- Email/password form
- Animated gradient background
- Error handling
- Auto-redirect after successful login

#### [NEW] [src/pages/Dashboard.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/pages/Dashboard.jsx)
Main dashboard with three-column layout:
- Left sidebar: Conversation list with search/filter
- Center: Active chat interface
- Right sidebar: Customer details and actions

#### [NEW] [src/components/ConversationList.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/components/ConversationList.jsx)
Display list of conversations with:
- Customer name/phone
- Last message preview
- Unread indicator
- Status badges
- Search and filter controls

#### [NEW] [src/components/ChatWindow.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/components/ChatWindow.jsx)
Chat interface with:
- Message bubbles (inbound/outbound styling)
- Timestamp formatting
- Message status indicators
- Auto-scroll to latest message
- Typing indicator placeholder

#### [NEW] [src/components/MessageInput.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/components/MessageInput.jsx)
Input area with:
- Text input with emoji support
- File upload button (images, documents)
- Form selector dropdown
- Send button
- Character counter

#### [NEW] [src/components/CustomerPanel.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/components/CustomerPanel.jsx)
Right sidebar showing:
- Customer information
- Conversation tags
- Agent assignment
- Quick actions (close conversation, send form)

#### [NEW] [src/pages/FormManager.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/pages/FormManager.jsx)
Form management interface:
- List of existing forms
- Create/edit form builder
- Field type selector (text, number, select, radio, checkbox)
- Form preview
- Delete confirmation

#### [NEW] [src/components/FormBuilder.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/src/components/FormBuilder.jsx)
Drag-and-drop form builder with:
- Add/remove fields
- Field configuration panel
- Field type selection
- Required toggle
- Options editor for select/radio fields

---

### Configuration & Documentation

#### [NEW] [backend/.env.example](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/backend/.env.example)
Environment variable template with placeholders for:
- MongoDB URI
- Twilio Account SID, Auth Token, WhatsApp number
- JWT secret
- Port configuration

#### [NEW] [frontend/.env.example](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/frontend/.env.example)
Frontend environment variables:
- API base URL
- Socket.IO URL

#### [NEW] [README.md](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/README.md)
Comprehensive documentation including:
- Project overview and features
- Architecture diagram
- Prerequisites (Node.js, MongoDB, Twilio account)
- Step-by-step setup instructions
- Twilio WhatsApp Sandbox activation guide
- Ngrok setup for webhook testing
- Environment configuration
- Running the application
- API endpoint documentation
- Usage guide for dashboard
- Troubleshooting section

#### [NEW] [SETUP_GUIDE.md](file:///C:/Users/DELL/.gemini/antigravity/scratch/whatsapp-integration/SETUP_GUIDE.md)
Detailed setup walkthrough:
- Creating Twilio account
- Activating WhatsApp Sandbox
- Configuring webhooks with ngrok
- Testing message flow
- Creating first agent account
- Sending test messages

## Verification Plan

### Automated Tests

Since this is a new project, we'll create basic integration tests:

**Backend API Tests**
```bash
cd backend
npm test
```
Tests to create:
- `tests/auth.test.js` - Test agent registration and login
- `tests/webhook.test.js` - Test webhook payload processing
- `tests/message.test.js` - Test message sending/retrieval

**Test Framework**: Use `jest` and `supertest` for Express API testing.

### Manual Verification

**1. Twilio WhatsApp Integration Test**
- Start backend server: `cd backend && npm start`
- Start ngrok: `ngrok http 5000`
- Configure Twilio webhook URL in Twilio Console
- Send a WhatsApp message to the Twilio sandbox number
- Verify message appears in database
- Expected: Message saved with correct conversation ID

**2. Dashboard Login & Chat Test**
- Start frontend: `cd frontend && npm run dev`
- Open browser to `http://localhost:5173`
- Create agent account via backend API or seed script
- Login with agent credentials
- Expected: Redirect to dashboard, see conversation list

**3. Send Message Test**
- Select a conversation from the list
- Type a message in the input field
- Click send button
- Check WhatsApp phone for message delivery
- Expected: Message appears in chat window and delivered to WhatsApp

**4. Form Sending Test**
- Navigate to Form Manager
- Create a new form (e.g., "Feedback Form" with name, email, rating fields)
- Return to dashboard
- Select a conversation
- Click "Send Form" and choose the created form
- Expected: Form sent as formatted WhatsApp message to customer

**5. Real-time Update Test**
- Open dashboard in browser
- Send WhatsApp message from customer phone
- Expected: New message appears in dashboard without refresh (via Socket.IO)

**6. File Upload Test**
- In chat window, click file upload button
- Select an image file
- Send to customer
- Expected: Image uploaded and sent via WhatsApp with media URL

---

All manual tests require:
- MongoDB running locally or connection to MongoDB Atlas
- Twilio account with WhatsApp Sandbox activated
- Ngrok running for webhook access
