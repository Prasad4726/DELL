# Setup Guide

## Prerequisites Installation

### 1. Install Node.js
Download and install Node.js (v16 or higher) from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### 2. Install PostgreSQL
Download and install PostgreSQL (v13 or higher) from [postgresql.org](https://www.postgresql.org/download/)

**Windows**: Use the installer and remember the password you set for the postgres user

**macOS**: 
```bash
brew install postgresql
brew services start postgresql
```

**Linux**:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib postgis
```

### 3. Install PostGIS Extension
PostGIS is required for geospatial queries.

**Windows**: Select PostGIS during PostgreSQL installation

**macOS**:
```bash
brew install postgis
```

**Linux**:
```bash
sudo apt-get install postgis
```

---

## Backend Setup

### Step 1: Database Setup

1. **Create Database**:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE parking_rental;

# Connect to the database
\c parking_rental

# Enable PostGIS extension
CREATE EXTENSION postgis;

# Exit psql
\q
```

2. **Run Schema**:
```bash
cd backend
psql -U postgres -d parking_rental -f database/schema.sql
```

### Step 2: Backend Configuration

1. **Install Dependencies**:
```bash
cd backend
npm install
```

2. **Configure Environment**:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
NODE_ENV=development
PORT=5000

# Update these with your PostgreSQL credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=parking_rental
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Generate a secure random string for JWT
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRE=7d

API_VERSION=v1
CORS_ORIGIN=http://localhost:3000
```

**Generate JWT Secret**:
```bash
# On Linux/macOS
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Step 3: Start Backend Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

Server will start on `http://localhost:5000`

**Verify Server**:
```bash
curl http://localhost:5000/health
```

---

## Mobile App Setup

### Step 1: Install React Native CLI

```bash
npm install -g react-native-cli
```

### Step 2: Platform-Specific Setup

#### Android Setup

1. **Install Android Studio** from [developer.android.com](https://developer.android.com/studio)

2. **Install Android SDK**:
   - Open Android Studio
   - Go to Settings > Appearance & Behavior > System Settings > Android SDK
   - Install Android 13.0 (API Level 33) or higher

3. **Configure Environment Variables**:

**Windows**:
```
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
Path=%Path%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
```

**macOS/Linux** (add to `~/.bash_profile` or `~/.zshrc`):
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

4. **Create Android Virtual Device (AVD)**:
   - Open Android Studio
   - Tools > Device Manager
   - Create Virtual Device
   - Select a device (e.g., Pixel 5)
   - Download and select a system image (API 33+)
   - Finish setup

#### iOS Setup (macOS only)

1. **Install Xcode** from App Store

2. **Install Xcode Command Line Tools**:
```bash
xcode-select --install
```

3. **Install CocoaPods**:
```bash
sudo gem install cocoapods
```

### Step 3: Mobile App Configuration

1. **Navigate to mobile directory**:
```bash
cd mobile
```

2. **Install Dependencies**:
```bash
npm install
```

3. **Install iOS Pods** (macOS only):
```bash
cd ios
pod install
cd ..
```

4. **Configure Environment**:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Update with your backend URL
# For Android emulator use: http://10.0.2.2:5000/api/v1
# For iOS simulator use: http://localhost:5000/api/v1
# For physical device use: http://YOUR_COMPUTER_IP:5000/api/v1
API_BASE_URL=http://10.0.2.2:5000/api/v1

# Get API key from: https://console.cloud.google.com/google/maps-apis
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Step 4: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps SDK for Android" and "Maps SDK for iOS"
4. Create credentials (API Key)
5. Copy the API key to `.env` file

### Step 5: Run Mobile App

1. **Start Metro Bundler**:
```bash
npm start
```

2. **Run on Android** (in new terminal):
```bash
# Start emulator first or connect physical device
npm run android
```

3. **Run on iOS** (macOS only, in new terminal):
```bash
npm run ios
```

---

## Troubleshooting

### Backend Issues

**Database Connection Error**:
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

**Port Already in Use**:
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Mobile App Issues

**Metro Bundler Issues**:
```bash
# Clear cache
npm start -- --reset-cache
```

**Android Build Errors**:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**iOS Build Errors**:
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

**Network Request Failed**:
- Check `API_BASE_URL` in `.env`
- Ensure backend server is running
- For Android emulator, use `http://10.0.2.2:5000/api/v1`
- For physical device, use your computer's IP address

---

## Testing the Application

### 1. Test Backend API

**Register a user**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "role": "USER"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Test Mobile App

1. Open the app
2. Register a new account
3. Login with credentials
4. Grant location permissions
5. View nearby parkings on map
6. Create a test booking

---

## Production Deployment

### Backend Deployment

1. **Environment Variables**:
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production database

2. **Database**:
   - Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
   - Enable SSL connections
   - Set up backups

3. **Server**:
   - Use process manager (PM2)
   - Set up reverse proxy (Nginx)
   - Enable HTTPS
   - Configure firewall

### Mobile App Deployment

**Android**:
1. Generate release keystore
2. Build release APK/AAB
3. Upload to Google Play Console

**iOS**:
1. Configure App Store Connect
2. Archive and upload to TestFlight
3. Submit for review

---

## Next Steps

1. Review [API Documentation](backend/API_DOCUMENTATION.md)
2. Explore the codebase
3. Customize features as needed
4. Set up payment gateway integration
5. Configure push notifications
6. Add analytics

For issues and questions, create an issue in the repository.
