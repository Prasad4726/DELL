# City-Wide Parking Rental Application - Implementation Plan

Build a production-ready mobile application for city-wide vehicle parking rental with React Native frontend and Node.js/Express backend using standard SQL database.

## User Review Required

> [!IMPORTANT]
> **Database Choice**: This implementation uses **standard SQL** (vendor-neutral) as specified. You'll need to choose a specific SQL database (MySQL, PostgreSQL, SQL Server, etc.) when deploying. The schema and queries are written to be compatible with all major SQL databases.

> [!IMPORTANT]
> **Payment Gateway**: The payment module is structured to integrate with payment gateways (Stripe, PayPal, Razorpay, etc.) but requires you to add your specific gateway credentials and implementation.

> [!IMPORTANT]
> **Map Provider**: You'll need to choose between Google Maps or Mapbox and provide API keys for the mobile app.

## Proposed Changes

### Backend Structure

The backend will follow clean architecture principles with clear separation of concerns.

#### [NEW] [package.json](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/package.json)
- Express.js server setup
- Dependencies: express, jsonwebtoken, bcryptjs, mysql2, dotenv, cors, express-validator
- Scripts for development and production

#### [NEW] [.env.example](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/.env.example)
- Environment configuration template
- Database connection settings
- JWT secret configuration
- Server port settings

#### [NEW] [server.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/server.js)
- Main application entry point
- Express server initialization
- Middleware setup
- Route registration
- Error handling

---

### Configuration Layer

#### [NEW] [config/database.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/config/database.js)
- Database connection pool setup
- Standard SQL connection configuration
- Connection error handling

#### [NEW] [config/constants.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/config/constants.js)
- Application-wide constants
- User roles, booking statuses, payment statuses
- Parking types

---

### Database Schema

#### [NEW] [database/schema.sql](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/database/schema.sql)
- Complete database schema in standard SQL
- Tables: Users, Parkings, ParkingSlots, Bookings, Payments, Reviews
- Proper indexes for performance
- Foreign key constraints
- No vendor-specific syntax

#### [NEW] [database/seed.sql](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/database/seed.sql)
- Sample data for testing
- Demo users, parkings, and slots

---

### Models Layer

#### [NEW] [models/User.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/User.js)
- User CRUD operations
- Find by email, ID
- Role-based queries

#### [NEW] [models/Parking.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/Parking.js)
- Parking CRUD operations
- Nearby parking search using Haversine formula
- Owner-specific parking queries

#### [NEW] [models/ParkingSlot.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/ParkingSlot.js)
- Slot management
- Availability checking
- Slot status updates

#### [NEW] [models/Booking.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/Booking.js)
- Booking CRUD with transaction support
- Overlap detection queries
- User booking history
- Critical concurrency handling

#### [NEW] [models/Payment.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/Payment.js)
- Payment record management
- Status tracking
- Booking-payment relationship

#### [NEW] [models/Review.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/Review.js)
- Review CRUD operations
- Parking rating calculations

---

### Services Layer

#### [NEW] [services/authService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/services/authService.js)
- User registration with password hashing
- Login with JWT token generation
- Token verification

#### [NEW] [services/parkingService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/services/parkingService.js)
- Parking creation and management
- Nearby search with distance calculation
- Availability filtering

#### [NEW] [services/bookingService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/services/bookingService.js)
- **Critical**: Transaction-based booking creation
- Overlap prevention logic
- Slot locking mechanism
- Price calculation
- Concurrent request handling

#### [NEW] [services/paymentService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/services/paymentService.js)
- Payment processing workflow
- Payment gateway integration structure
- Rollback on failure

---

### Middleware Layer

#### [NEW] [middlewares/auth.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/middlewares/auth.js)
- JWT token verification
- Role-based access control
- User, Owner, Admin guards

#### [NEW] [middlewares/validator.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/middlewares/validator.js)
- Input validation using express-validator
- Request sanitization
- Validation error handling

#### [NEW] [middlewares/errorHandler.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/middlewares/errorHandler.js)
- Centralized error handling
- Secure error responses
- Logging

---

### Controllers Layer

#### [NEW] [controllers/authController.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/controllers/authController.js)
- Signup endpoint
- Login endpoint
- Get current user profile

#### [NEW] [controllers/parkingController.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/controllers/parkingController.js)
- Create parking (owner)
- Update/delete parking
- Get nearby parkings
- Get parking details with available slots

#### [NEW] [controllers/bookingController.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/controllers/bookingController.js)
- Create booking with validation
- Get user bookings
- Cancel booking
- Get booking details

#### [NEW] [controllers/paymentController.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/controllers/paymentController.js)
- Process payment
- Payment webhook handling
- Get payment status

#### [NEW] [controllers/reviewController.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/controllers/reviewController.js)
- Create review
- Get parking reviews
- Update/delete review

#### [NEW] [controllers/adminController.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/controllers/adminController.js)
- Manage users
- Manage all parkings
- Manage all bookings
- System statistics

---

### Routes Layer

#### [NEW] [routes/auth.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/routes/auth.js)
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me

#### [NEW] [routes/parking.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/routes/parking.js)
- POST /api/parkings (owner)
- GET /api/parkings/nearby
- GET /api/parkings/:id
- PUT /api/parkings/:id (owner)
- DELETE /api/parkings/:id (owner)

#### [NEW] [routes/booking.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/routes/booking.js)
- POST /api/bookings
- GET /api/bookings
- GET /api/bookings/:id
- PUT /api/bookings/:id/cancel

#### [NEW] [routes/payment.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/routes/payment.js)
- POST /api/payments/process
- POST /api/payments/webhook
- GET /api/payments/:id

#### [NEW] [routes/review.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/routes/review.js)
- POST /api/reviews
- GET /api/reviews/parking/:parkingId
- PUT /api/reviews/:id
- DELETE /api/reviews/:id

#### [NEW] [routes/admin.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/routes/admin.js)
- GET /api/admin/users
- GET /api/admin/parkings
- GET /api/admin/bookings
- GET /api/admin/statistics

---

### Utilities

#### [NEW] [utils/helpers.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/utils/helpers.js)
- Haversine distance calculation
- Price calculation
- Date/time utilities
- Response formatters

---

### Frontend Structure (React Native)

#### [NEW] [package.json](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/package.json)
- React Native dependencies
- Redux Toolkit, Axios, React Navigation
- Map integration (react-native-maps)

#### [NEW] [App.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/App.js)
- Main app component
- Navigation setup
- Redux Provider

---

### Navigation

#### [NEW] [navigation/AppNavigator.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/navigation/AppNavigator.js)
- Stack and tab navigation
- Auth flow vs Main flow
- Screen routing

---

### Redux Store

#### [NEW] [store/index.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/store/index.js)
- Redux store configuration
- Middleware setup

#### [NEW] [store/slices/authSlice.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/store/slices/authSlice.js)
- Authentication state
- Login/logout actions
- Token management

#### [NEW] [store/slices/parkingSlice.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/store/slices/parkingSlice.js)
- Parking list state
- Nearby parkings
- Selected parking

#### [NEW] [store/slices/bookingSlice.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/store/slices/bookingSlice.js)
- Booking state
- Booking history
- Active bookings

---

### API Services

#### [NEW] [services/api.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/services/api.js)
- Axios instance configuration
- Token interceptor
- Error handling interceptor

#### [NEW] [services/authApi.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/services/authApi.js)
- Login/signup API calls
- Token refresh

#### [NEW] [services/parkingApi.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/services/parkingApi.js)
- Fetch nearby parkings
- Get parking details
- Owner parking management

#### [NEW] [services/bookingApi.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/services/bookingApi.js)
- Create booking
- Fetch booking history
- Cancel booking

#### [NEW] [services/paymentApi.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/services/paymentApi.js)
- Process payment
- Get payment status

---

### Screens

#### [NEW] [screens/LoginScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/screens/LoginScreen.js)
- Login form
- Navigation to signup

#### [NEW] [screens/SignupScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/screens/SignupScreen.js)
- Registration form
- Role selection

#### [NEW] [screens/HomeScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/screens/HomeScreen.js)
- Search bar
- Quick actions
- Recent bookings

#### [NEW] [screens/MapViewScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/screens/MapViewScreen.js)
- Map with user location
- Parking markers
- Marker tap to view details
- Live data from backend

#### [NEW] [screens/ParkingDetailsScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/screens/ParkingDetailsScreen.js)
- Parking information
- Available slots
- Reviews
- Book button

#### [NEW] [screens/SlotSelectionScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/screens/SlotSelectionScreen.js)
- Date/time picker
- Slot selection
- Price calculation
- Proceed to payment

#### [NEW] [screens/BookingConfirmationScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/screens/BookingConfirmationScreen.js)
- Booking summary
- Confirm details
- Payment trigger

#### [NEW] [screens/PaymentScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/screens/PaymentScreen.js)
- Payment method selection
- Payment processing
- Success/failure handling

#### [NEW] [screens/BookingHistoryScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/screens/BookingHistoryScreen.js)
- List of past and active bookings
- Booking details
- Cancel option

#### [NEW] [screens/ProfileScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/screens/ProfileScreen.js)
- User information
- Settings
- Logout

#### [NEW] [screens/OwnerDashboardScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/screens/OwnerDashboardScreen.js)
- Owner's parking list
- Add new parking
- Manage slots
- Earnings overview

---

### Reusable Components

#### [NEW] [components/ParkingCard.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/components/ParkingCard.js)
- Display parking information
- Distance, price, availability

#### [NEW] [components/BookingCard.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/components/BookingCard.js)
- Display booking details
- Status indicator

#### [NEW] [components/MapMarker.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/components/MapMarker.js)
- Custom map marker
- Available/full indicator

#### [NEW] [components/SlotItem.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/components/SlotItem.js)
- Slot display
- Selection state

#### [NEW] [components/DateTimePicker.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/components/DateTimePicker.js)
- Custom date/time picker
- Validation

---

### Utilities

#### [NEW] [utils/storage.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/utils/storage.js)
- AsyncStorage wrapper
- Token storage
- User data persistence

#### [NEW] [utils/validation.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/utils/validation.js)
- Form validation helpers
- Email, phone, password validation

#### [NEW] [utils/formatters.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/utils/formatters.js)
- Date/time formatting
- Currency formatting
- Distance formatting

---

### Documentation

#### [NEW] [README.md](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/README.md)
- Project overview
- Setup instructions
- API documentation
- Deployment guide

#### [NEW] [backend/README.md](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/README.md)
- Backend setup
- Database configuration
- API endpoints
- Environment variables

#### [NEW] [mobile/README.md](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/README.md)
- Mobile app setup
- Running on iOS/Android
- Configuration
- Build instructions

## Verification Plan

### Automated Tests

```bash
# Backend
cd backend
npm install
npm test

# Mobile
cd mobile
npm install
npm test
```

### Manual Verification

1. **Database Setup**
   - Execute schema.sql on chosen SQL database
   - Verify all tables created correctly
   - Run seed.sql for test data

2. **Backend Testing**
   - Start backend server
   - Test authentication endpoints
   - Test nearby parking search
   - Test booking creation with concurrent requests
   - Verify transaction rollback on conflicts

3. **Mobile App Testing**
   - Run on iOS/Android simulator
   - Test login/signup flow
   - Test map view with live data
   - Test complete booking flow
   - Test payment integration
   - Verify booking history

4. **Critical Booking Flow**
   - Attempt overlapping bookings
   - Verify slot locking works
   - Test concurrent booking requests
   - Confirm proper error handling

5. **Integration Testing**
   - End-to-end user journey
   - Owner parking management
   - Payment flow completion
   - Review system
