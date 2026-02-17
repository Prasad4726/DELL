# Expense Splitter Application - Implementation Plan

A modern, full-stack expense splitter web application with smooth animations, professional micro-interactions, and a fintech-style UI suitable for a developer portfolio.

## User Review Required

> [!IMPORTANT]
> This application will use MongoDB as the database. If you prefer a different database (PostgreSQL, MySQL, etc.), please let me know before I proceed.

> [!NOTE]
> The application will run on:
> - Frontend: http://localhost:5173 (Vite default)
> - Backend: http://localhost:5000

## Proposed Changes

### Project Structure

Creating a monorepo structure with separate client and server directories:

#### [NEW] Root Configuration Files
- `.gitignore` - Git ignore patterns for node_modules, env files, build artifacts
- `README.md` - Comprehensive setup and usage documentation
- `.env.example` - Environment variable template

---

### Backend (Node.js + Express + MongoDB)

#### [NEW] Server Configuration
- `server/package.json` - Backend dependencies (express, mongoose, cors, dotenv)
- `server/.env` - Environment variables (MongoDB URI, PORT)
- `server/src/server.js` - Entry point for the application
- `server/src/app.js` - Express app configuration with middleware

#### [NEW] Database Configuration
- `server/src/config/db.js` - MongoDB connection setup with error handling

#### [NEW] Models
- `server/src/models/participant.model.js` - Participant schema (name, createdAt)
- `server/src/models/expense.model.js` - Expense schema (participant, amount, createdAt)

#### [NEW] Controllers
- `server/src/controllers/participant.controller.js` - CRUD operations for participants
- `server/src/controllers/expense.controller.js` - CRUD operations for expenses
- `server/src/controllers/result.controller.js` - Calculate split results

#### [NEW] Services
- `server/src/services/calculation.service.js` - Core algorithm to calculate who owes whom

#### [NEW] Routes
- `server/src/routes/participant.routes.js` - Participant API endpoints
- `server/src/routes/expense.routes.js` - Expense API endpoints
- `server/src/routes/result.routes.js` - Calculation endpoint

#### [NEW] Middleware
- `server/src/middleware/errorHandler.js` - Global error handling middleware

---

### Frontend (React + Vite + Framer Motion)

#### [NEW] Frontend Configuration
- `client/package.json` - Frontend dependencies (react, vite, framer-motion, axios)
- `client/vite.config.js` - Vite configuration
- `client/index.html` - HTML entry point with SEO meta tags
- `client/src/main.jsx` - React entry point
- `client/src/App.jsx` - Main app component with routing

#### [NEW] Styling
- `client/src/styles/globals.css` - Modern design system with:
  - CSS custom properties for colors, spacing, shadows
  - Glassmorphism effects
  - Smooth transitions and animations
  - Responsive utilities
  - Blue primary color scheme with neutral grays

#### [NEW] UI Components
- `client/src/components/UI/Button.jsx` - Reusable button with hover effects, ripple animation
- `client/src/components/UI/Card.jsx` - Card component with shadow and hover lift
- `client/src/components/UI/Input.jsx` - Input field with floating label and focus glow

#### [NEW] Feature Components
- `client/src/components/Header/Header.jsx` - App header with animated icon and title
- `client/src/components/Participants/AddParticipant.jsx` - Form to add participants
- `client/src/components/Participants/ParticipantList.jsx` - Display participants with animations
- `client/src/components/Expenses/AddExpense.jsx` - Form to add expenses with dropdown
- `client/src/components/Expenses/ExpenseList.jsx` - Display expenses with slide-in animations
- `client/src/components/Results/Results.jsx` - Display calculation results with color coding

#### [NEW] Animations
- `client/src/animations/motionVariants.js` - Framer Motion variants for:
  - Page load stagger
  - Slide-in animations
  - Fade-in effects
  - Scale animations
  - Sequential reveals

#### [NEW] Services
- `client/src/services/api.js` - Axios instance and API call functions

#### [NEW] Pages
- `client/src/pages/Dashboard.jsx` - Main dashboard combining all components

#### [NEW] Assets
- `client/src/assets/money.svg` - Custom money icon for header

## Verification Plan

### Automated Tests

**Backend Server Start:**
```bash
cd server
npm install
npm start
```
Expected: Server running on http://localhost:5000 with "MongoDB connected" message

**Frontend Development Server:**
```bash
cd client
npm install
npm run dev
```
Expected: Vite dev server running on http://localhost:5173

### Manual Verification

I will use the browser tool to test the complete user flow:

1. **Initial Load Test**
   - Open http://localhost:5173
   - Verify page loads with fade-in animation
   - Check header displays "Expense Splitter" with animated icon

2. **Add Participants Test**
   - Add 3 participants: "Virat", "Akshay", "Rohit"
   - Verify each participant slides up with scale-in animation
   - Check hover effects on participant list items

3. **Add Expenses Test**
   - Add expense: Virat paid ₹150
   - Add expense: Akshay paid ₹200
   - Add expense: Rohit paid ₹100
   - Verify expenses slide in from right
   - Check amount highlights briefly

4. **Calculate Results Test**
   - Click "Calculate" button
   - Verify button hover glow and ripple animation
   - Check results card expands smoothly
   - Verify total expense shows ₹450
   - Verify per-person share shows ₹150
   - Check settlement results with color coding (green for gets back, red for owes)
   - Verify sequential fade-in for each result line

5. **Responsive Design Test**
   - Resize browser to mobile width (375px)
   - Verify cards stack vertically
   - Check all interactions work on small screens

6. **Animation & Micro-interaction Test**
   - Verify all button hover transitions (200-300ms)
   - Check input focus glow effects
   - Test card hover lift effects
   - Verify smooth easing on all animations

### API Endpoint Testing

Using browser console or network tab:
- `POST /api/participants` - Add participant
- `GET /api/participants` - Get all participants
- `POST /api/expenses` - Add expense
- `GET /api/expenses` - Get all expenses
- `GET /api/results/calculate` - Calculate split results
