# Screen Navigation Flow - Hostel Management App

## 1. Overview

This document defines the complete screen navigation structure for the React Native mobile application, organized by user role.

---

## 2. App Navigation Structure

```mermaid
graph TB
    START[App Launch] --> AUTH{Authenticated?}
    AUTH -->|No| ONBOARD[Onboarding Screens]
    ONBOARD --> LOGIN[Login/Register]
    LOGIN --> ROLE{User Role?}
    
    AUTH -->|Yes| ROLE
    
    ROLE -->|Owner| OWNER_TAB[Owner Tab Navigator]
    ROLE -->|Tenant| TENANT_TAB[Tenant Tab Navigator]
    ROLE -->|Guest| GUEST_TAB[Guest Tab Navigator]
    
    OWNER_TAB --> OWNER_HOME[Dashboard]
    OWNER_TAB --> OWNER_HOSTELS[My Hostels]
    OWNER_TAB --> OWNER_TENANTS[Tenants]
    OWNER_TAB --> OWNER_PAYMENTS[Payments]
    OWNER_TAB --> OWNER_PROFILE[Profile]
    
    TENANT_TAB --> TENANT_HOME[Home]
    TENANT_TAB --> TENANT_DUES[My Dues]
    TENANT_TAB --> TENANT_FOOD[Food Menu]
    TENANT_TAB --> TENANT_PROFILE[Profile]
    
    GUEST_TAB --> GUEST_SEARCH[Search Hostels]
    GUEST_TAB --> GUEST_BOOKINGS[My Bookings]
    GUEST_TAB --> GUEST_PROFILE[Profile]
```

---

## 3. Owner Navigation Flow

### **3.1 Owner Tab Navigator**

```
┌─────────────────────────────────────────┐
│  Bottom Tab Navigation (Owner)          │
├─────────────────────────────────────────┤
│  [Dashboard] [Hostels] [Tenants] [💰] [Profile] │
└─────────────────────────────────────────┘
```

### **3.2 Dashboard Tab**

```mermaid
graph LR
    DASH[Dashboard Screen] --> HOSTEL_DETAIL[Hostel Detail]
    DASH --> ANALYTICS[Analytics Screen]
    DASH --> PAYMENT_DETAIL[Payment Detail]
    DASH --> TENANT_DETAIL[Tenant Detail]
```

**Dashboard Screen:**
- Summary cards (Total Hostels, Occupancy, Revenue, Pending Dues)
- Recent payments list
- Upcoming dues alerts
- Quick actions (Add Hostel, Add Tenant)

### **3.3 Hostels Tab**

```mermaid
graph TB
    HOSTELS[My Hostels List] --> ADD_HOSTEL[Add Hostel Form]
    HOSTELS --> HOSTEL_DETAIL[Hostel Detail]
    
    HOSTEL_DETAIL --> EDIT_HOSTEL[Edit Hostel]
    HOSTEL_DETAIL --> FLOORS[Floors & Rooms]
    HOSTEL_DETAIL --> FOOD_MENU[Food Menu Management]
    HOSTEL_DETAIL --> ANNOUNCEMENTS[Announcements]
    
    FLOORS --> ADD_FLOOR[Add Floor]
    FLOORS --> ROOMS[Room List]
    
    ROOMS --> ADD_ROOM[Add Room Form]
    ROOMS --> ROOM_DETAIL[Room Detail]
    
    ROOM_DETAIL --> BEDS[Bed List]
    BEDS --> BED_DETAIL[Bed Detail]
```

### **3.4 Tenants Tab**

```mermaid
graph TB
    TENANTS[Tenants List] --> ADD_TENANT[Onboard Tenant Form]
    TENANTS --> TENANT_DETAIL[Tenant Detail]
    
    TENANT_DETAIL --> EDIT_TENANT[Edit Tenant]
    TENANT_DETAIL --> TENANT_DUES[Tenant Dues]
    TENANT_DETAIL --> PAYMENT_HISTORY[Payment History]
    TENANT_DETAIL --> VACATE[Initiate Vacating]
    
    VACATE --> CHECKOUT[Complete Checkout]
```

### **3.5 Payments Tab**

```mermaid
graph LR
    PAYMENTS[Payments List] --> PAYMENT_DETAIL[Payment Detail]
    PAYMENTS --> RECORD_OFFLINE[Record Offline Payment]
    PAYMENTS --> FILTER[Filter Payments]
```

---

## 4. Tenant Navigation Flow

### **4.1 Tenant Tab Navigator**

```
┌─────────────────────────────────────────┐
│  Bottom Tab Navigation (Tenant)         │
├─────────────────────────────────────────┤
│  [Home] [Dues] [Food Menu] [Profile]    │
└─────────────────────────────────────────┘
```

### **4.2 Home Tab**

```mermaid
graph TB
    HOME[Home Screen] --> BED_INFO[My Bed Details]
    HOME --> HOSTEL_INFO[Hostel Information]
    HOME --> ANNOUNCEMENTS[Announcements]
    HOME --> NOTIFICATIONS[Notifications]
    
    ANNOUNCEMENTS --> ANNOUNCEMENT_DETAIL[Announcement Detail]
    NOTIFICATIONS --> NOTIFICATION_DETAIL[Notification Detail]
```

**Home Screen:**
- Welcome message with tenant name
- Bed & room information card
- Hostel details (address, contact)
- Next due date alert
- Recent announcements
- Quick pay button

### **4.3 Dues Tab**

```mermaid
graph TB
    DUES[My Dues List] --> DUE_DETAIL[Due Detail]
    DUE_DETAIL --> PAY_NOW[Payment Gateway]
    PAY_NOW --> PAYMENT_SUCCESS[Payment Success]
    PAY_NOW --> PAYMENT_FAILED[Payment Failed]
    
    DUES --> PAYMENT_HISTORY[Payment History]
    PAYMENT_HISTORY --> RECEIPT[View Receipt]
```

### **4.4 Food Menu Tab**

```mermaid
graph LR
    FOOD[Weekly Food Menu] --> DAY_MENU[Day-wise Menu]
```

**Food Menu Screen:**
- Weekly calendar view
- Meal cards (Breakfast, Lunch, Dinner)
- Serving times
- Menu items list

---

## 5. Guest Navigation Flow

### **5.1 Guest Tab Navigator**

```
┌─────────────────────────────────────────┐
│  Bottom Tab Navigation (Guest)          │
├─────────────────────────────────────────┤
│  [Search] [Bookings] [Profile]          │
└─────────────────────────────────────────┘
```

### **5.2 Search Tab**

```mermaid
graph TB
    SEARCH[Search Hostels] --> FILTERS[Apply Filters]
    SEARCH --> RESULTS[Search Results]
    
    RESULTS --> HOSTEL_DETAIL[Hostel Detail]
    
    HOSTEL_DETAIL --> GALLERY[Image Gallery]
    HOSTEL_DETAIL --> MAP[Map View]
    HOSTEL_DETAIL --> FOOD_MENU[Food Menu]
    HOSTEL_DETAIL --> BOOK[Book Bed]
    
    BOOK --> SELECT_DATES[Select Dates]
    SELECT_DATES --> GUEST_INFO[Guest Information]
    GUEST_INFO --> PAYMENT[Payment Gateway]
    PAYMENT --> BOOKING_SUCCESS[Booking Confirmed]
```

**Search Screen:**
- City search bar
- Date range picker (Check-in/Check-out)
- Filters (Hostel Type, Price Range, Amenities)
- Hostel cards with images, price, rating

### **5.3 Bookings Tab**

```mermaid
graph TB
    BOOKINGS[My Bookings] --> UPCOMING[Upcoming Bookings]
    BOOKINGS --> PAST[Past Bookings]
    
    UPCOMING --> BOOKING_DETAIL[Booking Detail]
    PAST --> BOOKING_DETAIL
    
    BOOKING_DETAIL --> CANCEL[Cancel Booking]
    BOOKING_DETAIL --> DIRECTIONS[Get Directions]
    BOOKING_DETAIL --> CONTACT[Contact Hostel]
```

---

## 6. Common Screens (All Roles)

### **6.1 Authentication Flow**

```mermaid
graph TB
    SPLASH[Splash Screen] --> ONBOARD[Onboarding Carousel]
    ONBOARD --> ROLE_SELECT[Select Role]
    
    ROLE_SELECT --> LOGIN[Login Screen]
    ROLE_SELECT --> REGISTER[Register Screen]
    
    LOGIN --> OTP[OTP Verification]
    REGISTER --> OTP
    
    OTP --> HOME{Navigate to Role Home}
```

**Onboarding Screens (3 slides):**
1. "Manage Your Hostel Effortlessly"
2. "Track Payments & Tenants"
3. "Find Short Stays Anywhere"

**Login Screen:**
- Email/Phone input
- Password input
- "Forgot Password?" link
- "Don't have an account? Register"

**Register Screen:**
- Full Name
- Email
- Phone
- Password
- Confirm Password
- Role selection (Owner/Tenant/Guest)
- Terms & Conditions checkbox

### **6.2 Profile Tab (All Roles)**

```mermaid
graph TB
    PROFILE[Profile Screen] --> EDIT_PROFILE[Edit Profile]
    PROFILE --> CHANGE_PASSWORD[Change Password]
    PROFILE --> NOTIFICATIONS_SETTINGS[Notification Settings]
    PROFILE --> HELP[Help & Support]
    PROFILE --> ABOUT[About App]
    PROFILE --> LOGOUT[Logout]
```

---

## 7. Screen Details by Module

### **7.1 Dashboard Screen (Owner)**

**Components:**
- Header with greeting and notification bell
- Summary cards (4 cards in 2x2 grid)
  - Total Hostels
  - Occupancy Rate
  - Monthly Revenue
  - Pending Dues
- Section: "Recent Payments" (last 5)
- Section: "Upcoming Dues" (next 7 days)
- FAB: "Quick Actions" (Add Hostel, Add Tenant)

**Navigation:**
- Tap summary card → Navigate to respective detail screen
- Tap payment → Payment Detail
- Tap due → Tenant Detail
- Tap notification bell → Notifications List

---

### **7.2 Add Hostel Screen (Owner)**

**Form Fields:**
1. Basic Information
   - Hostel Name *
   - Description
   - Hostel Type * (Radio: Boys/Girls/Co-Ed)
   
2. Location
   - Address Line 1 *
   - Address Line 2
   - City * (Autocomplete)
   - State * (Dropdown)
   - Pincode *
   - Get Current Location (Button)
   
3. Contact
   - Contact Phone *
   - Contact Email
   
4. Amenities (Multi-select chips)
   - WiFi, Laundry, AC, Parking, Security, CCTV, Gym, etc.
   
5. Pricing
   - Monthly Rent Min *
   - Monthly Rent Max *
   - Daily Rate (for guest bookings)
   
6. Settings
   - Food Included (Toggle)
   - Allow Guest Bookings (Toggle)
   
7. Images (Upload up to 10)

**Validation:**
- All * fields required
- Rent Min <= Rent Max
- Valid email format
- Valid phone format
- Pincode: 6 digits

**Actions:**
- Save & Continue → Navigate to Add Floor
- Save & Exit → Navigate to Hostels List

---

### **7.3 Onboard Tenant Screen (Owner)**

**Form Sections:**

1. **Select Bed**
   - Hostel Dropdown *
   - Floor Dropdown *
   - Room Dropdown *
   - Bed Dropdown * (only AVAILABLE beds)

2. **Personal Information**
   - Full Name *
   - Email
   - Phone * (with OTP verification)
   - Photo Upload *

3. **KYC Documents**
   - Aadhaar Number * (12 digits, masked)
   - Aadhaar Image Upload * (Front & Back)

4. **Emergency Contact**
   - Name *
   - Phone *
   - Relation *

5. **Occupancy Details**
   - Joining Date * (Date picker)
   - Notice Period Days (Default: 30)

6. **Financial Details**
   - Monthly Rent * (Pre-filled from bed)
   - Security Deposit *
   - Advance Paid

**Validation:**
- Phone unique check
- Aadhaar unique check
- Bed availability check
- File size limits (Photo: 2MB, Aadhaar: 5MB)
- Joining date >= today

**Actions:**
- Submit → Upload files → Create tenant → Send welcome SMS → Navigate to Tenant Detail

---

### **7.4 Tenant Home Screen (Tenant)**

**Components:**
- Header: "Welcome, [Tenant Name]"
- Bed Information Card
  - Bed Number
  - Room Number
  - Floor
  - Room Type
  - Amenities icons
  
- Hostel Information Card
  - Hostel Name
  - Address
  - Contact Phone (Call button)
  - Contact Email (Email button)
  
- Next Due Alert Card (if pending)
  - Due Date
  - Amount
  - "Pay Now" button
  
- Announcements Section
  - Latest 3 announcements
  - "View All" link
  
- Quick Actions
  - View Food Menu
  - Payment History
  - Raise Complaint (future feature)

---

### **7.5 Payment Screen (Tenant)**

**Due Detail Screen:**
- Due Month & Year
- Due Date
- Breakdown:
  - Rent Amount
  - Food Charges
  - Electricity Charges
  - Other Charges
  - Late Fee (if overdue)
  - **Total Amount**
  
- Payment Status Badge
- Days Overdue (if applicable)

**Actions:**
- "Pay Now" button → Razorpay Gateway
  - Opens Razorpay SDK
  - User completes payment
  - App verifies signature
  - Shows success/failure screen
  - Sends receipt via email

---

### **7.6 Search Hostels Screen (Guest)**

**Search Bar:**
- City input (Autocomplete)
- Date Range Picker (Check-in, Check-out)
- "Search" button

**Filters (Bottom Sheet):**
- Hostel Type (Boys/Girls/Co-Ed)
- Price Range (Slider: ₹0 - ₹2000)
- Amenities (Multi-select)
- Sort By (Price, Rating, Distance)

**Results List:**
- Hostel Card:
  - Image carousel
  - Hostel Name
  - City
  - Daily Rate
  - Rating (stars)
  - Distance from current location
  - Available Beds count
  - Amenities icons (top 4)
  - "View Details" button

**Empty State:**
- "No hostels found in [City]"
- "Try adjusting your filters"

---

### **7.7 Hostel Detail Screen (Guest)**

**Sections:**

1. **Image Gallery**
   - Full-width carousel
   - Tap to open full-screen gallery

2. **Basic Info**
   - Hostel Name
   - Hostel Type badge
   - Rating & Reviews count
   - Address with "Get Directions" button

3. **Pricing**
   - Daily Rate (large, prominent)
   - "Book Now" button

4. **Amenities**
   - Grid of amenity icons with labels

5. **Food Menu**
   - "View Weekly Menu" expandable section

6. **About**
   - Description text

7. **Contact**
   - Phone (Call button)
   - Email (Email button)

8. **Location**
   - Map view with marker

**Actions:**
- "Book Now" → Select Dates Screen

---

### **7.8 Booking Flow (Guest)**

**Step 1: Select Dates**
- Check-in Date Picker
- Check-out Date Picker
- Number of Days (auto-calculated)
- Total Amount (auto-calculated)
- "Continue" button

**Step 2: Guest Information**
- Guest Name * (Pre-filled from profile)
- Guest Phone * (Pre-filled)
- Guest Email
- Special Requests (Optional)
- "Proceed to Payment" button

**Step 3: Payment**
- Booking Summary
  - Hostel Name
  - Dates
  - Number of Days
  - Daily Rate
  - Total Amount
- "Pay ₹[Amount]" button → Razorpay

**Step 4: Confirmation**
- Success animation
- Booking ID
- QR Code (for check-in)
- Hostel contact details
- "View Booking" button
- "Get Directions" button

---

## 8. Navigation Patterns

### **8.1 Stack Navigation**
- Each tab has its own stack navigator
- Allows deep navigation within tabs
- Back button returns to previous screen in stack

### **8.2 Modal Navigation**
- Used for forms (Add Hostel, Add Tenant)
- Full-screen modals with close button
- Prevents accidental navigation away

### **8.3 Bottom Sheets**
- Filters
- Quick actions
- Confirmation dialogs

### **8.4 Deep Linking**
- `/hostel/:hostelId` → Hostel Detail
- `/booking/:bookingId` → Booking Detail
- `/payment/:paymentId` → Payment Receipt
- Push notification → Relevant screen

---

## 9. Screen States

### **9.1 Loading States**
- Skeleton screens for lists
- Shimmer effect for cards
- Spinner for button actions

### **9.2 Empty States**
- Illustration + message
- Call-to-action button
- Examples:
  - "No hostels yet. Add your first hostel!"
  - "No bookings found. Start exploring!"

### **9.3 Error States**
- Error icon + message
- "Retry" button
- Examples:
  - "Failed to load data. Please try again."
  - "Network error. Check your connection."

---

## 10. Offline Support

### **10.1 Cached Data**
- Dashboard summary
- Hostel list
- Tenant list
- Food menu

### **10.2 Offline Indicators**
- Banner at top: "You're offline"
- Disabled actions that require network
- Queue actions for sync when online

---

This completes the screen navigation flow. Next, I'll create detailed module-wise feature breakdowns.
