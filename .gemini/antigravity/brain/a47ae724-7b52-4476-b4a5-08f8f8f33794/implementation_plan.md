# City-Wide Vehicle Parking Rental Application - Implementation Plan

This plan outlines the development of a production-ready parking rental application with a Node.js/Express/PostgreSQL backend and React Native frontend.

## User Review Required

> [!IMPORTANT]
> **Technology Choices**
> - **Map Provider**: The plan uses **Google Maps** for React Native. If you prefer **Mapbox**, please specify.
> - **Payment Gateway**: The payment module is structured to integrate with Stripe/PayPal/Razorpay. Please specify your preferred provider.
> - **Database**: Using **PostgreSQL** with **Sequelize ORM**. Confirm if this is acceptable or if you prefer raw SQL queries.

> [!WARNING]
> **Deployment Considerations**
> - This implementation focuses on application code. Deployment configuration (Docker, CI/CD, cloud hosting) is not included.
> - PostgreSQL geospatial queries use PostGIS extension for production-grade geo-search. Ensure your PostgreSQL instance supports PostGIS.

## Proposed Changes

### Backend Application

#### [NEW] Project Structure
```
parking-rental-backend/
├── config/
│   ├── database.js
│   └── jwt.js
├── models/
│   ├── index.js
│   ├── User.js
│   ├── Parking.js
│   ├── ParkingSlot.js
│   ├── Booking.js
│   ├── Payment.js
│   └── Review.js
├── controllers/
│   ├── authController.js
│   ├── parkingController.js
│   ├── bookingController.js
│   ├── paymentController.js
│   └── reviewController.js
├── routes/
│   ├── authRoutes.js
│   ├── parkingRoutes.js
│   ├── bookingRoutes.js
│   ├── paymentRoutes.js
│   └── reviewRoutes.js
├── services/
│   ├── authService.js
│   ├── parkingService.js
│   ├── bookingService.js
│   ├── paymentService.js
│   └── geoService.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── validationMiddleware.js
│   └── errorMiddleware.js
├── utils/
│   ├── validators.js
│   ├── helpers.js
│   └── constants.js
├── database/
│   └── schema.sql
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

#### [NEW] [package.json](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/package.json)
Backend dependencies including Express, Sequelize, JWT, bcrypt, and validation libraries.

#### [NEW] [.env.example](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/.env.example)
Environment variables template for database, JWT, and API configuration.

#### [NEW] [server.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/server.js)
Main application entry point with Express setup, middleware configuration, and route mounting.

---

#### Database Layer

#### [NEW] [schema.sql](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/database/schema.sql)
Complete PostgreSQL schema with PostGIS extension for geospatial queries, all tables, indexes, and constraints.

#### [NEW] [database.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/config/database.js)
Sequelize database connection configuration with connection pooling.

#### [NEW] [models/index.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/index.js)
Model initialization and association setup.

#### [NEW] [User.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/User.js)
User model with role-based access (USER, OWNER, ADMIN), password hashing hooks.

#### [NEW] [Parking.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/Parking.js)
Parking location model with geolocation (PostGIS POINT type), pricing, and type (PUBLIC/PRIVATE).

#### [NEW] [ParkingSlot.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/ParkingSlot.js)
Individual parking slot model with status tracking (AVAILABLE, OCCUPIED, RESERVED).

#### [NEW] [Booking.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/Booking.js)
Booking model with time-based reservations, status tracking, and price calculation.

#### [NEW] [Payment.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/Payment.js)
Payment tracking model with status management (PENDING, SUCCESS, FAILED).

#### [NEW] [Review.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/models/Review.js)
Review and rating model for parking locations.

---

#### Authentication & Security

#### [NEW] [authService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/services/authService.js)
Authentication business logic: user registration, login, password hashing, JWT generation.

#### [NEW] [authController.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/controllers/authController.js)
Authentication endpoints: signup, login, token refresh.

#### [NEW] [authMiddleware.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/middlewares/authMiddleware.js)
JWT verification middleware for protected routes.

#### [NEW] [roleMiddleware.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/middlewares/roleMiddleware.js)
Role-based access control middleware (USER, OWNER, ADMIN).

#### [NEW] [authRoutes.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/routes/authRoutes.js)
Authentication route definitions.

---

#### Parking Management

#### [NEW] [parkingService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/services/parkingService.js)
Parking business logic: CRUD operations, nearby search with PostGIS, availability filtering.

#### [NEW] [geoService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/services/geoService.js)
Geospatial utilities: distance calculation, radius search using PostGIS ST_DWithin.

#### [NEW] [parkingController.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/controllers/parkingController.js)
Parking endpoints: create, update, delete, search nearby, get details.

#### [NEW] [parkingRoutes.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/routes/parkingRoutes.js)
Parking route definitions with role-based protection.

---

#### Booking System (Critical)

#### [NEW] [bookingService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/services/bookingService.js)
**Critical booking logic**: time-based slot reservation, overlap prevention using database transactions, concurrent booking handling with row-level locking, automatic price calculation, slot status management.

#### [NEW] [bookingController.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/controllers/bookingController.js)
Booking endpoints: create booking, cancel booking, get user bookings, get booking details.

#### [NEW] [bookingRoutes.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/routes/bookingRoutes.js)
Booking route definitions.

---

#### Payment Module

#### [NEW] [paymentService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/services/paymentService.js)
Payment processing: create payment records, status tracking, booking rollback on failure, payment gateway integration structure.

#### [NEW] [paymentController.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/controllers/paymentController.js)
Payment endpoints: initiate payment, verify payment, webhook handling.

#### [NEW] [paymentRoutes.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/routes/paymentRoutes.js)
Payment route definitions.

---

#### Reviews System

#### [NEW] [reviewController.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/controllers/reviewController.js)
Review endpoints: create review, get parking reviews, calculate average ratings.

#### [NEW] [reviewRoutes.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/routes/reviewRoutes.js)
Review route definitions.

---

#### Utilities & Middleware

#### [NEW] [validationMiddleware.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/middlewares/validationMiddleware.js)
Input validation middleware using express-validator.

#### [NEW] [errorMiddleware.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/middlewares/errorMiddleware.js)
Centralized error handling middleware with secure error responses.

#### [NEW] [validators.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/utils/validators.js)
Validation schemas for all endpoints.

#### [NEW] [helpers.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/utils/helpers.js)
Utility functions: date/time helpers, price calculation, formatting.

#### [NEW] [constants.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/utils/constants.js)
Application constants: roles, statuses, error messages.

---

### Frontend Application (React Native)

#### [NEW] Project Structure
```
parking-rental-mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── SignupScreen.js
│   │   ├── home/
│   │   │   └── HomeScreen.js
│   │   ├── map/
│   │   │   └── MapViewScreen.js
│   │   ├── parking/
│   │   │   ├── ParkingDetailsScreen.js
│   │   │   └── SlotSelectionScreen.js
│   │   ├── booking/
│   │   │   ├── BookingConfirmationScreen.js
│   │   │   └── BookingHistoryScreen.js
│   │   ├── payment/
│   │   │   └── PaymentScreen.js
│   │   └── profile/
│   │       └── ProfileScreen.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   └── Loader.js
│   │   ├── map/
│   │   │   ├── ParkingMarker.js
│   │   │   └── UserLocationMarker.js
│   │   ├── parking/
│   │   │   ├── ParkingCard.js
│   │   │   └── SlotItem.js
│   │   └── booking/
│   │       └── BookingCard.js
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── parkingService.js
│   │   ├── bookingService.js
│   │   └── paymentService.js
│   ├── store/
│   │   ├── index.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── parkingSlice.js
│   │   │   ├── bookingSlice.js
│   │   │   └── userSlice.js
│   │   └── middleware/
│   │       └── apiMiddleware.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   └── App.js
├── .env.example
├── package.json
└── README.md
```

#### [NEW] [package.json](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/package.json)
React Native dependencies: navigation, Redux Toolkit, Axios, Google Maps, UI components.

#### [NEW] [App.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/App.js)
Root application component with Redux Provider and navigation setup.

---

#### Navigation

#### [NEW] [AppNavigator.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/navigation/AppNavigator.js)
Main navigation controller: switches between auth and main navigators based on authentication state.

#### [NEW] [AuthNavigator.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/navigation/AuthNavigator.js)
Authentication flow navigation: login and signup screens.

#### [NEW] [MainNavigator.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/navigation/MainNavigator.js)
Main app navigation: tab navigator with home, map, bookings, and profile.

---

#### Redux Store

#### [NEW] [store/index.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/store/index.js)
Redux store configuration with middleware and persistence.

#### [NEW] [authSlice.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/store/slices/authSlice.js)
Authentication state management: login, logout, token storage.

#### [NEW] [parkingSlice.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/store/slices/parkingSlice.js)
Parking data state: nearby parkings, selected parking, search filters.

#### [NEW] [bookingSlice.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/store/slices/bookingSlice.js)
Booking state: active bookings, booking history, current booking flow.

#### [NEW] [userSlice.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/store/slices/userSlice.js)
User profile state management.

---

#### API Integration

#### [NEW] [api.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/services/api.js)
Axios instance configuration with interceptors for authentication tokens and error handling.

#### [NEW] [authService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/services/authService.js)
Authentication API calls: login, signup, token refresh.

#### [NEW] [parkingService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/services/parkingService.js)
Parking API calls: search nearby, get details, owner management.

#### [NEW] [bookingService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/services/bookingService.js)
Booking API calls: create booking, get history, cancel booking.

#### [NEW] [paymentService.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/services/paymentService.js)
Payment API calls: initiate payment, verify status.

---

#### Screens - Authentication

#### [NEW] [LoginScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/screens/auth/LoginScreen.js)
Login screen with email/password input, validation, and error handling.

#### [NEW] [SignupScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/screens/auth/SignupScreen.js)
Signup screen with user details, role selection, and validation.

---

#### Screens - Core Features

#### [NEW] [HomeScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/screens/home/HomeScreen.js)
Home dashboard with quick actions, nearby parkings list, and search functionality.

#### [NEW] [MapViewScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/screens/map/MapViewScreen.js)
Interactive map with user location, parking markers, marker tap to view details, live data from backend.

#### [NEW] [ParkingDetailsScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/screens/parking/ParkingDetailsScreen.js)
Parking location details: address, pricing, available slots, reviews, book button.

#### [NEW] [SlotSelectionScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/screens/parking/SlotSelectionScreen.js)
Slot selection with date/time picker, available slots display, price calculation.

#### [NEW] [BookingConfirmationScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/screens/booking/BookingConfirmationScreen.js)
Booking summary and confirmation before payment.

#### [NEW] [PaymentScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/screens/payment/PaymentScreen.js)
Payment interface with method selection and gateway integration.

#### [NEW] [BookingHistoryScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/screens/booking/BookingHistoryScreen.js)
List of past and active bookings with status tracking.

#### [NEW] [ProfileScreen.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/screens/profile/ProfileScreen.js)
User profile with settings, logout, and owner-specific parking management.

---

#### Reusable Components

#### [NEW] [Button.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/components/common/Button.js)
Reusable button component with variants (primary, secondary, outline).

#### [NEW] [Input.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/components/common/Input.js)
Reusable input component with validation and error display.

#### [NEW] [Card.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/components/common/Card.js)
Card container component for consistent styling.

#### [NEW] [Loader.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/components/common/Loader.js)
Loading indicator component.

#### [NEW] [ParkingMarker.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/components/map/ParkingMarker.js)
Custom map marker for parking locations with availability indicator.

#### [NEW] [ParkingCard.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/components/parking/ParkingCard.js)
Parking location card for list views.

#### [NEW] [SlotItem.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/components/parking/SlotItem.js)
Individual slot display component with status indicator.

#### [NEW] [BookingCard.js](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/mobile/src/components/booking/BookingCard.js)
Booking item card for history view.

---

### Documentation

#### [NEW] [README.md](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/README.md)
Project overview, architecture explanation, setup instructions for both backend and frontend.

#### [NEW] [API_DOCUMENTATION.md](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/backend/API_DOCUMENTATION.md)
Complete API documentation with endpoints, request/response formats, authentication requirements.

#### [NEW] [SETUP.md](file:///C:/Users/DELL/.gemini/antigravity/scratch/parking-rental-app/SETUP.md)
Detailed setup guide: PostgreSQL installation, environment configuration, running migrations, starting servers.

## Verification Plan

### Automated Tests

**Backend API Testing**:
```bash
# Install dependencies
cd backend
npm install

# Set up test database
createdb parking_rental_test

# Run API tests (to be implemented)
npm test
```

**Test Coverage**:
- Authentication: signup, login, JWT validation
- Parking CRUD: create, read, update, delete
- Nearby search: geolocation queries
- Booking: concurrent bookings, overlap prevention, price calculation
- Payment: status tracking, rollback logic

### Manual Verification

**Backend Verification**:
1. Start PostgreSQL and create database
2. Run migrations from `schema.sql`
3. Start backend server: `npm run dev`
4. Test API endpoints using Postman/Thunder Client:
   - POST `/api/auth/signup` - Create users with different roles
   - POST `/api/auth/login` - Verify JWT token generation
   - POST `/api/parkings` - Create parking locations (as OWNER)
   - GET `/api/parkings/nearby?lat=X&lng=Y&radius=5000` - Test geo-search
   - POST `/api/bookings` - Create booking and verify slot locking
   - Test concurrent bookings to same slot (should fail for second request)

**Frontend Verification**:
1. Start React Native metro bundler: `npm start`
2. Run on iOS simulator: `npm run ios` or Android: `npm run android`
3. Test user flows:
   - Complete signup/login flow
   - View map with parking markers
   - Tap marker to see details
   - Select slot and create booking
   - View booking history
4. Verify API integration and error handling

**Integration Testing**:
- Complete end-to-end booking flow from mobile app
- Verify real-time slot availability updates
- Test payment flow (mock payment gateway)
- Verify booking appears in history
- Test owner parking management features
