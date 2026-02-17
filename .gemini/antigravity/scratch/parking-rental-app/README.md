# City-Wide Parking Rental Application

A production-ready mobile application for city-wide vehicle parking rental with React Native frontend and Node.js/Express backend.

## 🚀 Features

### For Users
- 🗺️ **Find Nearby Parking** - Real-time map view with available parking locations
- 📅 **Time-Based Booking** - Book parking slots for specific date and time
- 💳 **Secure Payments** - Multiple payment methods (Card, UPI, Wallet, Net Banking)
- 📜 **Booking History** - Track all past and active bookings
- ⭐ **Reviews & Ratings** - Rate and review parking locations
- 🔔 **Real-Time Availability** - Live slot availability updates

### For Parking Owners
- 🏢 **Manage Parkings** - Add and manage multiple parking locations
- 🅿️ **Slot Management** - Control slot availability and maintenance
- 📊 **Dashboard** - View earnings and booking statistics
- 🔧 **Flexible Pricing** - Set custom hourly rates

### For Admins
- 👥 **User Management** - Manage all users and roles
- 🏛️ **System Overview** - Monitor all parkings and bookings
- 📈 **Analytics** - System-wide statistics and reports

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Standard SQL (MySQL/PostgreSQL/SQL Server compatible)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Architecture**: Clean Architecture with layered structure

### Frontend (Mobile)
- **Framework**: React Native
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Maps**: React Native Maps (Google Maps/Mapbox)
- **HTTP Client**: Axios
- **Icons**: React Native Vector Icons

## 📁 Project Structure

```
parking-rental-app/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── database/           # SQL schemas and migrations
│   ├── middlewares/        # Auth, validation, error handling
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point
│
├── mobile/                 # React Native mobile app
│   └── src/
│       ├── components/     # Reusable components
│       ├── screens/        # App screens
│       ├── services/       # API services
│       ├── store/          # Redux store & slices
│       ├── utils/          # Utilities & constants
│       └── App.js          # Main app component
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL/PostgreSQL/SQL Server
- React Native development environment
- Android Studio / Xcode (for mobile development)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=parking_rental
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   ```

4. **Set up database**
   
   Execute the SQL schema:
   ```bash
   # For MySQL
   mysql -u your_db_user -p parking_rental < database/schema-standard.sql
   
   # For PostgreSQL
   psql -U your_db_user -d parking_rental -f database/schema-standard.sql
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

   Backend will run on `http://localhost:5000`

### Mobile App Setup

1. **Navigate to mobile directory**
   ```bash
   cd mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   API_BASE_URL=http://localhost:5000/api/v1
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   # OR
   MAPBOX_ACCESS_TOKEN=your_mapbox_token
   ```

4. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

5. **Run the app**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Parkings
- `GET /api/parkings/nearby` - Get nearby parkings
- `GET /api/parkings/:id` - Get parking details
- `POST /api/parkings` - Create parking (Owner)
- `PUT /api/parkings/:id` - Update parking (Owner)
- `DELETE /api/parkings/:id` - Delete parking (Owner)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:id` - Get payment status

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/parking/:parkingId` - Get parking reviews

See [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) for complete API reference.

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention
- Secure error handling
- Transaction-safe booking logic

## 🎯 Key Features Implementation

### Nearby Parking Search
Uses **Haversine formula** for accurate distance calculation:
```sql
-- Calculate distance in kilometers
SELECT *, 
  (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
   cos(radians(longitude) - radians(?)) + 
   sin(radians(?)) * sin(radians(latitude)))) AS distance
FROM parkings
HAVING distance < ?
ORDER BY distance;
```

### Concurrent Booking Handling
- Transaction-based booking creation
- Slot locking mechanism
- Overlap detection
- Automatic rollback on conflicts

### Payment Integration
- Ready for gateway integration (Stripe, PayPal, Razorpay)
- Payment status tracking
- Automatic booking rollback on payment failure

## 📱 Mobile App Screens

- **Authentication**: Login, Signup
- **Main**: Home, Map View, Bookings, Profile
- **Booking Flow**: Parking Details, Slot Selection, Payment
- **Owner**: Dashboard, Add/Edit Parking, Manage Slots

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Mobile tests
cd mobile
npm test
```

## 📦 Deployment

### Backend Deployment
- Deploy to Heroku, AWS, DigitalOcean, or any Node.js hosting
- Set environment variables
- Use production database
- Enable SSL/HTTPS

### Mobile App Deployment
- **Android**: Build APK/AAB and publish to Google Play Store
- **iOS**: Build IPA and publish to Apple App Store

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@parkingrental.com or open an issue.

## 🙏 Acknowledgments

- React Native community
- Express.js team
- All open-source contributors

---

**Built with ❤️ for efficient urban parking management**
