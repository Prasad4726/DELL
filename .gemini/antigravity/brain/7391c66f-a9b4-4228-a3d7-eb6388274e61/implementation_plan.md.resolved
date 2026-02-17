# Expense Splitter - Implementation Plan

A modern, animated frontend UI for an Expense Splitter web application with fintech-inspired design, built with React and Framer Motion for smooth animations.

## Proposed Changes

### Project Initialization

#### [NEW] Project Directory
- Initialize Vite + React project in `C:\Users\DELL\.gemini\antigravity\scratch\expense-splitter`
- Configure with React, Framer Motion for animations, and React Router for navigation
- Set up modern development environment with hot reload

---

### Design System & Styling

#### [NEW] [index.css](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/index.css)
- CSS custom properties for fintech-inspired color palette (blue primary, neutral grays)
- Typography system using professional sans-serif fonts (Inter from Google Fonts)
- Spacing scale and border radius tokens (16-20px for cards)
- Shadow utilities for depth and elevation
- Animation timing functions and durations
- Gradient backgrounds and effects

---

### Core Components

#### [NEW] [Header.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/components/Header.jsx)
- App title "Expense Splitter" with animated money icon
- Responsive header with navigation
- Smooth entrance animation on mount

#### [NEW] [Input.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/components/Input.jsx)
- Reusable input component with floating label animation
- Focus state with soft highlight effect
- Support for text, number, and currency inputs
- Accessible form controls

#### [NEW] [Button.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/components/Button.jsx)
- Primary and secondary button variants
- Hover effects: scale transform + glow
- Smooth transitions (200-300ms)
- Touch-friendly sizing

#### [NEW] [Card.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/components/Card.jsx)
- Rounded card container (16-20px radius)
- Soft shadows for depth
- Hover lift animation
- Staggered entrance animations

#### [NEW] [ParticipantChip.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/components/ParticipantChip.jsx)
- Display participant names as chips
- Remove button with smooth exit animation
- Slide-up entrance animation

#### [NEW] [ExpenseItem.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/components/ExpenseItem.jsx)
- Display individual expense entries
- Slide-in from right animation
- Clean, scannable layout

---

### Main Screens

#### [NEW] [Dashboard.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/pages/Dashboard.jsx)
- Main screen with centered card-based layout
- **Add Participants Section**: Input with floating label, add button, participant list with chips
- **Add Expense Section**: Participant dropdown, amount input with ₹ symbol, add button, expense list
- **Calculate Section**: Prominent CTA button
- **Results Section**: Total expense, per-person share, settlement summary (who owes/gets back)
- Staggered card animations on page load
- Smooth expand animation for results reveal

#### [NEW] [History.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/pages/History.jsx)
- List view of past expense splits
- Cards showing date, total amount, participant count
- Hover lift animation on cards
- Click animation to navigate to details
- Fade-in entrance animation

#### [NEW] [ExpenseDetail.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/pages/ExpenseDetail.jsx)
- Detailed breakdown view for a specific split
- Summary card with total and participants
- Complete expense list
- Settlement breakdown (read-only)
- Sequential reveal animation for settlement lines
- Fade-in sections

---

### Application Structure

#### [NEW] [App.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/App.jsx)
- Main application component with React Router setup
- Route configuration for Dashboard, History, and Detail screens
- Global layout structure

#### [NEW] [main.jsx](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/src/main.jsx)
- Application entry point
- React DOM rendering

#### [NEW] [index.html](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/index.html)
- HTML template with Google Fonts import
- Meta tags for responsive design
- SEO-friendly structure

---

### Configuration Files

#### [NEW] [package.json](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/package.json)
- Dependencies: React, React Router, Framer Motion
- Dev dependencies: Vite, ESLint
- Scripts for development and build

#### [NEW] [vite.config.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/expense-splitter/vite.config.js)
- Vite configuration for React
- Development server settings

## Verification Plan

### Automated Tests
- Run development server: `npm run dev`
- Verify hot reload functionality
- Check console for errors

### Manual Verification
1. **Dashboard Functionality**
   - Add participants and verify slide-up animation
   - Add expenses and verify slide-in animation
   - Calculate splits and verify results expand animation
   - Test all input validations

2. **Navigation & History**
   - Navigate to History screen
   - Verify card hover effects
   - Click to view expense details
   - Verify back navigation

3. **Animations & Interactions**
   - Page load staggered animations
   - Button hover effects (scale + glow)
   - Input focus highlights
   - Card hover lift effects

4. **Responsive Design**
   - Test on mobile viewport (375px)
   - Test on tablet viewport (768px)
   - Test on desktop viewport (1440px)
   - Verify touch-friendly button sizes

5. **Visual Quality**
   - Verify color palette and gradients
   - Check typography and spacing
   - Validate shadow depths
   - Ensure smooth transitions (200-300ms)
