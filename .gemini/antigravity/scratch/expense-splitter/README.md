# Expense Splitter

A modern, full-stack expense splitter web application with smooth animations and professional micro-interactions.

## 🎨 Features

- **Modern UI Design**: Fintech-style interface with glassmorphism effects
- **Smooth Animations**: Framer Motion powered animations and micro-interactions
- **Real-time Calculations**: Smart algorithm to calculate who owes whom
- **Responsive Design**: Works seamlessly on desktop and mobile
- **RESTful API**: Clean backend architecture with Express and MongoDB

## 🛠 Tech Stack

### Frontend
- React 18
- Vite
- Framer Motion (animations)
- Axios (API calls)
- CSS3 with custom properties

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or connection URI)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone or navigate to the project directory

```bash
cd expense-splitter
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory (already created):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-splitter
NODE_ENV=development
```

### 4. Install Frontend Dependencies

```bash
cd ../client
npm install
```

## 🎯 Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or run mongod directly
mongod
```

### Start Backend Server

```bash
cd server
npm start
```

The server will run on `http://localhost:5000`

### Start Frontend Development Server

In a new terminal:

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📱 Usage

1. **Add Participants**: Enter names of people sharing expenses
2. **Add Expenses**: Record who paid how much
3. **Calculate**: Click the calculate button to see who owes whom
4. **Reset**: Clear all data to start fresh

## 🎨 Design Features

- **Page Load Animations**: Staggered fade-in effects
- **Button Interactions**: Hover glow, scale, and ripple effects
- **Input Focus**: Smooth glow and floating labels
- **Card Hover**: Lift effect with enhanced shadows
- **List Animations**: Sequential slide-in for items
- **Results Reveal**: Smooth expand animation with color-coded settlements

## 📡 API Endpoints

### Participants
- `GET /api/participants` - Get all participants
- `POST /api/participants` - Add a participant
- `DELETE /api/participants/:id` - Delete a participant
- `DELETE /api/participants` - Delete all participants

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add an expense
- `DELETE /api/expenses/:id` - Delete an expense
- `DELETE /api/expenses` - Delete all expenses

### Results
- `GET /api/results/calculate` - Calculate split results

## 🏗 Project Structure

```
expense-splitter/
├── client/                 # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── animations/    # Framer Motion configs
│   │   └── styles/        # Global styles
│   └── package.json
│
├── server/                # Backend
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── models/       # Mongoose models
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Error handling
│   └── package.json
│
└── README.md
```

## 🎯 Algorithm

The app uses a greedy algorithm to minimize the number of transactions:

1. Calculate total expense and per-person share
2. Determine each person's balance (paid - share)
3. Separate into creditors (positive balance) and debtors (negative balance)
4. Match debtors with creditors to minimize transactions

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize!

## 📄 License

ISC

## 👨‍💻 Author

Built with ❤️ as a full-stack developer portfolio project
