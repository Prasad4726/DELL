# WhatsApp Integration Setup Guide

This guide will walk you through setting up the WhatsApp integration platform from scratch.

## Step 1: Create Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free trial account
3. Verify your email and phone number
4. You'll receive **$15 in trial credit**

## Step 2: Activate WhatsApp Sandbox

### Why the Sandbox?

The Twilio WhatsApp Sandbox allows you to test WhatsApp messaging without needing Facebook Business Manager approval. It's perfect for development and testing.

### Activation Steps:

1. Log into [Twilio Console](https://console.twilio.com/)
2. In the left sidebar, navigate to:
   - **Messaging** → **Try it out** → **Send a WhatsApp message**

3. You'll see a page with:
   - A **sandbox phone number** (e.g., +1 415 523 8886)
   - A **join code** (e.g., "join abc-123")

4. **Join the Sandbox:**
   - Open WhatsApp on your phone
   - Send a message to the sandbox number with the join code
   - Example: Send `join abc-123` to `+1 415 523 8886`
   - You'll receive a confirmation message

5. **Get Your Credentials:**
   - Click your account dropdown (top right)
   - Go to **Account** → **API keys & tokens**
   - Copy your **Account SID** and **Auth Token**

## Step 3: Install MongoDB

### Option A: Local MongoDB

**Windows:**
```bash
# Download MongoDB Community Server from mongodb.com
# Install and start the service
# Default connection: mongodb://localhost:27017
```

**Mac (via Homebrew):**
```bash
brew install mongodb-community
brew services start mongodb-community
```

### Option B: MongoDB Atlas (Cloud)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new **M0 Free** cluster
4. Click **Connect** → **Connect your application**
5. Copy the connection string
6. Replace `<password>` with your database password

Example connection string:
```
mongodb+srv://username:password@cluster0.mongodb.net/whatsapp-integration
```

## Step 4: Install ngrok

ngrok creates a secure tunnel to your localhost, allowing Twilio to send webhooks to your local development server.

### Installation:

**Windows:**
1. Download from [ngrok.com/download](https://ngrok.com/download)
2. Unzip and move `ngrok.exe` to a folder in your PATH
3. Or just run it from the download folder

**Mac (via Homebrew):**
```bash
brew install ngrok
```

**Linux:**
```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list && \
  sudo apt update && sudo apt install ngrok
```

### Free Account (Optional but Recommended):

1. Create a free account at [ngrok.com](https://ngrok.com)
2. Get your auth token from the dashboard
3. Connect your account:
```bash
ngrok authtoken YOUR_AUTH_TOKEN
```

## Step 5: Project Setup

### 1. Install Dependencies

```bash
# Backend
cd whatsapp-integration/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Backend Environment

Create `backend/.env`:
```bash
# Server
PORT=5000
NODE_ENV=development

# MongoDB (choose one)
# Local:
MONGODB_URI=mongodb://localhost:27017/whatsapp-integration

# OR Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp-integration

# Twilio (from Step 2)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Security
JWT_SECRET=my_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
SOCKET_CORS_ORIGIN=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
```

### 3. Configure Frontend Environment

Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Step 6: Start the Application

Open **3 terminal windows**:

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
✅ Server running on port 5000
🔌 Socket.IO: Enabled
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in 500 ms
➜  Local:   http://localhost:5173/
```

### Terminal 3: ngrok
```bash
ngrok http 5000
```

Copy the **HTTPS forwarding URL**:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:5000
```

## Step 7: Configure Twilio Webhooks

1. Go back to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Settings** → **WhatsApp Sandbox Settings**
3. Set the webhook URLs:

   **When a message comes in:**
   ```
   https://abc123.ngrok.io/api/webhook/whatsapp
   ```

   **Status callback URL:**
   ```
   https://abc123.ngrok.io/api/webhook/status
   ```

4. **HTTP Method**: POST (for both)
5. Click **Save**

> ⚠️ **Important:** Every time you restart ngrok, the URL changes. You'll need to update the Twilio webhooks with the new URL.

## Step 8: Create Agent Account

Use cURL, Postman, or any HTTP client:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin Agent",
    "role": "admin"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Agent registered successfully",
  "data": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin Agent",
    "role": "admin"
  },
  "token": "eyJhbGciOi..."
}
```

## Step 9: Test the System

### 1. Login to Dashboard

1. Open browser to `http://localhost:5173`
2. Login with:
   - Email: `admin@example.com`
   - Password: `password123`

### 2. Send Test Message

1. From your phone (the one joined to Twilio sandbox)
2. Send a WhatsApp message to the sandbox number:
   ```
   Hello, I need support!
   ```

3. The message should appear in the dashboard within seconds!

### 3. Reply from Dashboard

1. Select the new conversation
2. Type a reply message
3. Click send
4. Check your phone - you should receive the message!

### 4. Send a Form

1. Click **Form Manager** in the sidebar
2. Create a new form:
   - Name: "Customer Feedback"
   - Add fields: Name, Email, Rating
3. Go back to dashboard
4. Select a conversation
5. Click "Send Form" → Select "Customer Feedback"
6. Customer receives the formatted form via WhatsApp

## Step 10: Production Deployment (Optional)

For production deployment:

1. **Get WhatsApp Business API approval** from Facebook
2. Deploy backend to:
   - Heroku, Railway, Render, or DigitalOcean
3. Deploy frontend to:
   - Vercel, Netlify, or Cloudflare Pages
4. Use production MongoDB (MongoDB Atlas)
5. Update Twilio webhooks to production backend URL
6. Add proper SSL certificates
7. Use environment-specific configuration

## Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:** Ensure MongoDB is running locally or connection string is correct for Atlas.

### Issue: "Messages not appearing in dashboard"
**Solution:**
- Verify ngrok is running
- Check webhook URL in Twilio is correct
- Look for errors in backend console

### Issue: "Cannot send messages"
**Solution:**
- Verify Twilio credentials are correct
- Check Twilio account balance (trial accounts need to verify recipient numbers)
- Ensure customer Phone number joined the sandbox

### Issue: "Socket.IO not connecting"
**Solution:**
- Check SOCKET_CORS_ORIGIN in backend .env
- Verify frontend VITE_SOCKET_URL is correct
- Restart both servers

### Issue: "File upload fails"
**Solution:**
- Check MAX_FILE_SIZE in .env
- Verify `uploads/` directory exists in backend folder
- Ensure file type is allowed (images, PDFs, docs)

## Next Steps

- **Customize the UI:** Update colors and styling in `frontend/src/index.css`
- **Add More Form Fields:** Extend the form builder with new field types
- **Implement Chatbot:** Add automated responses for common questions
- **Analytics Dashboard:** Track conversation metrics and agent performance
- **Multi-language Support:** Add internationalization

## Need Help?

- Twilio Docs: [https://www.twilio.com/docs/whatsapp](https://www.twilio.com/docs/whatsapp)
- MongoDB Docs: [https://docs.mongodb.com/](https://docs.mongodb.com/)
- React Docs: [https://react.dev/](https://react.dev/)

---

**Congratulations! 🎉**  
Your WhatsApp integration platform is now up and running!
