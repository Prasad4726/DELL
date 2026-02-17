# Module-wise Feature Breakdown

## Module 1: Authentication & Authorization

### **1.1 User Registration**

**Screen Purpose:**
Allow new users to create an account and select their role (Owner/Tenant/Guest).

**UI Flow:**
1. User opens app → Onboarding carousel (3 slides)
2. Tap "Get Started" → Role Selection Screen
3. Select role → Registration Form
4. Fill form → Submit
5. OTP sent to phone → OTP Verification Screen
6. Enter OTP → Account created → Navigate to role-specific home

**API Endpoints:**
- `POST /auth/register`
- `POST /auth/verify-otp`
- `POST /auth/resend-otp`

**Validation Rules:**
- **Email**: Valid format, unique in database
- **Phone**: Valid with country code (+91), unique, 10 digits
- **Password**: 
  - Min 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (@$!%*?&)
- **Full Name**: 3-255 characters, no special characters except space, hyphen, apostrophe
- **Role**: Must be one of [OWNER, TENANT, GUEST]
- **OTP**: 6 digits, valid for 5 minutes

**Edge Cases:**
1. **Duplicate Email/Phone**: Show error "Email/Phone already registered. Please login."
2. **Weak Password**: Show specific requirements not met
3. **OTP Expired**: Allow resend with 30-second cooldown
4. **Too Many OTP Attempts**: Block for 15 minutes after 5 failed attempts
5. **Network Failure During Registration**: Save form data locally, retry on reconnect
6. **Partial Registration**: If OTP verification fails, allow user to complete verification later

**Business Logic:**
- Hash password using bcrypt (12 salt rounds)
- Generate 6-digit OTP, store in Redis with 5-min expiry
- Send OTP via SMS (Twilio/AWS SNS)
- Create user record with `email_verified: false, phone_verified: false`
- On OTP verification, set `phone_verified: true`
- Generate JWT access token (15 min) and refresh token (7 days)
- Store refresh token in database with device info

---

### **1.2 User Login**

**Screen Purpose:**
Authenticate existing users and provide access to their account.

**UI Flow:**
1. Enter email/phone + password
2. Tap "Login"
3. If credentials valid → Navigate to role-specific home
4. If invalid → Show error message

**API Endpoints:**
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

**Validation Rules:**
- **Email/Phone**: Required, valid format
- **Password**: Required
- **Device Info**: Capture device type, device ID, FCM token

**Edge Cases:**
1. **Invalid Credentials**: Show "Invalid email/password" after 3 attempts, suggest "Forgot Password?"
2. **Account Suspended**: Show "Account suspended. Contact support."
3. **Unverified Email**: Allow login but show banner "Verify your email"
4. **Multiple Devices**: Allow login on multiple devices, store separate refresh tokens
5. **Rate Limiting**: After 5 failed attempts, block IP for 15 minutes
6. **Forgot Password**: Send reset link to email, valid for 1 hour

**Business Logic:**
- Verify password using bcrypt compare
- Update `last_login_at` timestamp
- Generate new access + refresh tokens
- Store refresh token with device info and FCM token
- Revoke old refresh tokens for same device (optional: keep last 3)

---

### **1.3 Role-Based Access Control**

**Implementation:**
- Middleware: `authMiddleware` → Verify JWT token
- Middleware: `roleMiddleware(['OWNER'])` → Check user role
- Middleware: `ownershipMiddleware` → Verify resource ownership

**Example:**
```javascript
// Only owner can access their own hostel
router.get('/hostels/:hostelId', 
  authMiddleware, 
  roleMiddleware(['OWNER']), 
  ownershipMiddleware('hostel'),
  getHostelDetails
);
```

**Permission Matrix:**

| Resource | Owner | Tenant | Guest |
|----------|-------|--------|-------|
| Create Hostel | ✅ | ❌ | ❌ |
| View Own Hostel | ✅ | ❌ | ❌ |
| View Public Hostel | ✅ | ✅ | ✅ |
| Add Tenant | ✅ (own hostel) | ❌ | ❌ |
| View Tenant Details | ✅ (own hostel) | ✅ (self) | ❌ |
| Pay Rent | ❌ | ✅ (self) | ❌ |
| Create Booking | ❌ | ❌ | ✅ |

---

## Module 2: Multi-Hostel Management

### **2.1 Create Hostel**

**Screen Purpose:**
Allow hostel owners to add new hostel properties to the system.

**UI Flow:**
1. Owner taps "Add Hostel" from Dashboard or Hostels tab
2. Multi-step form:
   - Step 1: Basic Info (Name, Type, Description)
   - Step 2: Location (Address, City, State, Pincode, Map)
   - Step 3: Contact (Phone, Email)
   - Step 4: Amenities (Multi-select)
   - Step 5: Pricing (Monthly rent range, Daily rate)
   - Step 6: Settings (Food included, Guest bookings)
   - Step 7: Images (Upload up to 10)
3. Review summary → Submit
4. Success → Navigate to Hostel Detail

**API Endpoints:**
- `POST /hostels`
- `POST /hostels/:hostelId/images`
- `GET /hostels/my-hostels`

**Validation Rules:**
- **Name**: 3-255 chars, required
- **Hostel Type**: Required, one of [BOYS, GIRLS, CO_ED]
- **Address**: Line1 required, City/State/Pincode required
- **Pincode**: 6 digits
- **Latitude/Longitude**: Valid coordinates (-90 to 90, -180 to 180)
- **Contact Phone**: Valid format
- **Monthly Rent**: Min <= Max, both positive
- **Daily Rate**: Required if guest bookings enabled
- **Images**: Max 10, each max 5MB, formats: jpg, png, webp

**Edge Cases:**
1. **Duplicate Hostel Name**: Allow (different owners can have same name)
2. **Invalid Coordinates**: Show error "Invalid location. Please select on map."
3. **Image Upload Failure**: Allow retry, show which images failed
4. **Partial Form Submission**: Save draft locally, allow resume
5. **Network Failure**: Queue for upload when online
6. **Geocoding Failure**: Allow manual lat/long entry

**Business Logic:**
- Auto-generate UUID for hostel
- Upload images to S3/Azure Blob
- Store image URLs in JSON array
- Set `owner_id` from authenticated user
- Set `is_active: true` by default
- Create default floor (Ground Floor) automatically

---

### **2.2 Hostel Detail & Edit**

**Screen Purpose:**
View comprehensive hostel information and allow editing.

**UI Components:**
- Image carousel (full-width)
- Basic info card (Name, Type, City)
- Location card (Address, Map view)
- Amenities grid
- Pricing card
- Statistics card (Total beds, Occupied, Available, Occupancy %)
- Action buttons (Edit, Add Floor, View Tenants, Announcements)

**API Endpoints:**
- `GET /hostels/:hostelId`
- `PATCH /hostels/:hostelId`
- `DELETE /hostels/:hostelId` (soft delete)

**Validation Rules (Edit):**
- Same as Create Hostel
- Cannot change `owner_id`
- Cannot delete if active tenants exist

**Edge Cases:**
1. **Edit While Tenants Exist**: Warn "Changes may affect existing tenants"
2. **Delete Hostel**: Require confirmation, check for active tenants
3. **Deactivate Hostel**: Set `is_active: false`, hide from guest search
4. **Concurrent Edits**: Use optimistic locking with `updated_at` timestamp

---

## Module 3: Room & Bed Management

### **3.1 Floor Management**

**Screen Purpose:**
Organize hostel into floors for better structure.

**UI Flow:**
1. From Hostel Detail → Tap "Floors & Rooms"
2. List of floors with room count
3. Tap "Add Floor" → Form (Floor Number, Floor Name)
4. Submit → Floor created

**API Endpoints:**
- `POST /hostels/:hostelId/floors`
- `GET /hostels/:hostelId/floors`
- `PATCH /floors/:floorId`
- `DELETE /floors/:floorId`

**Validation Rules:**
- **Floor Number**: Integer, unique within hostel, 0-99
- **Floor Name**: Optional, max 100 chars

**Edge Cases:**
1. **Duplicate Floor Number**: Show error "Floor already exists"
2. **Delete Floor with Rooms**: Prevent deletion, show "Remove all rooms first"
3. **Reorder Floors**: Allow drag-to-reorder (update floor_number)

---

### **3.2 Room Management**

**Screen Purpose:**
Create and manage rooms within floors.

**UI Flow:**
1. From Floor List → Tap floor → Room List
2. Tap "Add Room" → Form:
   - Room Number
   - Room Name (optional)
   - Room Type (Single/Double/Triple/Quad/Dormitory)
   - Total Beds (auto-filled based on type)
   - Has AC (toggle)
   - Has Attached Bathroom (toggle)
   - Amenities (multi-select)
   - Rent per Bed
3. Submit → Room + Beds created automatically

**API Endpoints:**
- `POST /hostels/:hostelId/floors/:floorId/rooms`
- `GET /hostels/:hostelId/rooms`
- `PATCH /rooms/:roomId`
- `DELETE /rooms/:roomId`

**Validation Rules:**
- **Room Number**: Required, unique within hostel, alphanumeric
- **Room Type**: Required, one of [SINGLE, DOUBLE, TRIPLE, QUAD, DORMITORY]
- **Total Beds**: 
  - SINGLE: 1
  - DOUBLE: 2
  - TRIPLE: 3
  - QUAD: 4
  - DORMITORY: 5-20
- **Rent per Bed**: Positive number, required

**Edge Cases:**
1. **Duplicate Room Number**: Show error "Room number already exists"
2. **Delete Room with Occupied Beds**: Prevent deletion
3. **Change Room Type**: Warn if beds occupied, require confirmation
4. **Bulk Room Creation**: Allow CSV upload for multiple rooms

**Business Logic:**
- Auto-create beds based on `total_beds`
- Bed numbering: `{room_number}-A`, `{room_number}-B`, etc.
- Set all beds to `status: AVAILABLE`
- Copy room amenities to beds

---

### **3.3 Bed Management**

**Screen Purpose:**
Manage individual bed status and pricing.

**UI Flow:**
1. From Room Detail → Bed List (grid view)
2. Each bed shows: Bed Number, Status badge, Tenant name (if occupied)
3. Tap bed → Bed Detail
4. Actions: Edit Status, Set Custom Rent, View Tenant

**API Endpoints:**
- `GET /hostels/:hostelId/beds/available`
- `PATCH /beds/:bedId/status`
- `PATCH /beds/:bedId/rent`

**Validation Rules:**
- **Status**: One of [AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE]
- **Custom Rent**: Positive number, overrides room's rent_per_bed

**Edge Cases:**
1. **Set to OCCUPIED Manually**: Prevent, must assign tenant
2. **Set to AVAILABLE While Occupied**: Prevent, must vacate tenant first
3. **MAINTENANCE Status**: Bed hidden from availability search
4. **RESERVED Status**: Temporary hold (e.g., for pending booking), auto-release after 24 hours

**Business Logic:**
- Bed status updated automatically on tenant assignment/vacating
- Custom rent used for tenant's monthly rent if set
- Availability search filters by `status: AVAILABLE` and `is_active: true`

---

## Module 4: Tenant Lifecycle Management

### **4.1 Tenant Onboarding**

**Screen Purpose:**
Add new tenant to hostel and assign bed.

**UI Flow:**
1. Owner taps "Add Tenant"
2. Multi-step form:
   - Step 1: Select Bed (Hostel → Floor → Room → Bed)
   - Step 2: Personal Info (Name, Email, Phone, Photo)
   - Step 3: KYC (Aadhaar Number, Aadhaar Images)
   - Step 4: Emergency Contact
   - Step 5: Occupancy (Joining Date, Notice Period)
   - Step 6: Financial (Monthly Rent, Security Deposit, Advance)
3. Review → Submit
4. Files uploaded → Tenant created → Bed status updated → Welcome SMS sent

**API Endpoints:**
- `POST /hostels/:hostelId/tenants` (multipart/form-data)
- `GET /hostels/:hostelId/tenants`
- `GET /tenants/:tenantId`

**Validation Rules:**
- **Bed Selection**: Must be AVAILABLE
- **Phone**: Unique across all tenants
- **Aadhaar Number**: 12 digits, unique, validated using Verhoeff algorithm
- **Photo**: Max 2MB, jpg/png
- **Aadhaar Images**: Max 5MB each, jpg/png/pdf
- **Joining Date**: >= today
- **Monthly Rent**: Positive, typically matches bed's rent
- **Security Deposit**: Typically 2x monthly rent
- **Advance Paid**: <= Security Deposit

**Edge Cases:**
1. **Bed Occupied Between Selection and Submission**: Show error "Bed no longer available"
2. **Duplicate Aadhaar**: Show error "Aadhaar already registered"
3. **Duplicate Phone**: Show error "Phone already registered"
4. **File Upload Failure**: Allow retry, show progress
5. **Tenant Already Has User Account**: Link `user_id` if phone matches
6. **Partial Onboarding**: Save draft, allow resume

**Business Logic:**
- Upload Aadhaar images to encrypted S3 bucket (AES-256)
- Upload photo to public S3 bucket
- Create tenant record with `status: ACTIVE`
- Update bed `status: OCCUPIED`
- Create first month's due record
- Send welcome SMS with hostel details and app download link
- If phone matches existing user, link `user_id` and send app login credentials

**Security:**
- Aadhaar images encrypted at rest
- Aadhaar number masked in UI (show only last 4 digits)
- Access to Aadhaar restricted to owner only

---

### **4.2 Tenant Profile & Management**

**Screen Purpose:**
View and manage tenant information.

**UI Components:**
- Profile photo
- Personal info (Name, Email, Phone)
- Bed assignment (Bed, Room, Floor)
- Hostel info
- Joining date, Status badge
- Financial summary (Monthly rent, Security deposit, Pending dues)
- Emergency contact
- Action buttons (Edit, View Dues, Payment History, Initiate Vacating)

**API Endpoints:**
- `GET /tenants/:tenantId`
- `PATCH /tenants/:tenantId`

**Validation Rules (Edit):**
- Cannot change bed if tenant is ACTIVE (must vacate first)
- Cannot change joining date if dues exist
- Can update contact info, emergency contact, monthly rent

**Edge Cases:**
1. **Change Monthly Rent**: Affects future dues only, not past
2. **Update Emergency Contact**: No restrictions
3. **Tenant Requests Edit**: Tenant can view but not edit (read-only)

---

### **4.3 Tenant Vacating Process**

**Screen Purpose:**
Manage tenant checkout and bed release.

**UI Flow:**

**Step 1: Initiate Vacating**
1. Owner taps "Initiate Vacating" from Tenant Detail
2. Form: Vacating Date, Reason
3. Submit → Tenant status: NOTICE_PERIOD

**Step 2: Complete Checkout**
1. On vacating date, owner taps "Complete Checkout"
2. Form:
   - Final Settlement Calculation (auto-filled)
     - Security Deposit: ₹16,000
     - Pending Dues: ₹0
     - Damage Charges: ₹1,000
     - Refund Amount: ₹15,000
   - Refund Method (Cash/Bank Transfer)
   - Notes
3. Submit → Tenant status: VACATED, Bed status: AVAILABLE

**API Endpoints:**
- `POST /tenants/:tenantId/vacate`
- `POST /tenants/:tenantId/checkout`

**Validation Rules:**
- **Vacating Date**: >= (today + notice_period_days)
- **Damage Charges**: Optional, positive number
- **Refund Amount**: <= (Security Deposit - Pending Dues - Damage Charges)

**Edge Cases:**
1. **Pending Dues on Vacating**: Deduct from security deposit
2. **Early Vacating**: Allow with owner approval, may forfeit notice period rent
3. **Extend Stay**: Cancel vacating notice, set status back to ACTIVE
4. **Partial Refund**: If security < pending dues, show negative refund (tenant owes)

**Business Logic:**
- On initiate vacating:
  - Set `status: NOTICE_PERIOD`
  - Set `vacating_date`
  - Send notification to tenant
- On complete checkout:
  - Calculate final settlement
  - Create refund payment record (negative amount)
  - Set `status: VACATED`
  - Update bed `status: AVAILABLE`
  - Archive tenant record (move to `tenants_archive` after 2 years)

---

## Module 5: Food Menu Management

### **5.1 Create/Update Food Menu**

**Screen Purpose:**
Define weekly food menu for hostel tenants.

**UI Flow:**
1. Owner navigates to Hostel Detail → "Food Menu"
2. Weekly calendar view (7 days x 3 meals = 21 slots)
3. Tap slot (e.g., Monday Lunch) → Form:
   - Meal Type (auto-filled)
   - Menu Items (multi-input, add/remove items)
   - Serving Time (Start - End)
4. Save → Menu updated

**API Endpoints:**
- `POST /hostels/:hostelId/food-menu`
- `GET /hostels/:hostelId/food-menu`
- `DELETE /food-menus/:menuId`

**Validation Rules:**
- **Day of Week**: 0-6 (Sunday to Saturday)
- **Meal Type**: One of [BREAKFAST, LUNCH, DINNER, SNACKS]
- **Menu Items**: Array of strings, min 1 item, each max 100 chars
- **Serving Time**: Valid time format (HH:MM), Start < End

**Edge Cases:**
1. **Duplicate Meal Slot**: Update existing menu (upsert)
2. **Empty Menu**: Allow deletion
3. **Copy Menu**: Allow copy from previous week
4. **Special Menu**: Allow date-specific menu (effective_from, effective_to)

**Business Logic:**
- Store menu items as JSON array
- Default serving times:
  - Breakfast: 08:00 - 10:00
  - Lunch: 12:30 - 14:30
  - Dinner: 20:00 - 22:00
- Menu visible to all tenants and guests (public)

---

### **5.2 View Food Menu (Tenant/Guest)**

**Screen Purpose:**
Display weekly food menu for tenants and guests.

**UI Components:**
- Weekly tab view (Mon-Sun)
- Each day shows 3 meal cards (Breakfast, Lunch, Dinner)
- Each card: Meal type, Menu items list, Serving time

**API Endpoints:**
- `GET /hostels/:hostelId/food-menu`

**Edge Cases:**
1. **No Menu Defined**: Show "Menu not available"
2. **Partial Menu**: Show only defined meals
3. **Today's Menu**: Highlight current day

---

## Module 6: Payment & Rent Tracking

### **6.1 Auto-Generate Monthly Dues**

**Background Job:**
Runs on 1st of every month at 12:00 AM.

**Logic:**
```javascript
// For each active tenant
for (tenant of activeTenants) {
  const dueDate = new Date(year, month, tenant.rent_due_day);
  
  createTenantDue({
    tenant_id: tenant.id,
    due_month: month,
    due_year: year,
    due_date: dueDate,
    rent_amount: tenant.monthly_rent,
    food_charges: hostel.food_included ? calculateFoodCharges() : 0,
    electricity_charges: 0, // Manual entry by owner
    other_charges: 0,
    late_fee: 0,
    total_amount: rent_amount + food_charges,
    pending_amount: total_amount,
    status: 'PENDING'
  });
}
```

**API Endpoints:**
- `POST /admin/generate-dues` (manual trigger)

---

### **6.2 Payment by Tenant**

**Screen Purpose:**
Allow tenant to pay rent online.

**UI Flow:**
1. Tenant navigates to "My Dues" tab
2. List of dues (Pending, Overdue, Paid)
3. Tap pending due → Due Detail Screen
4. Tap "Pay Now" → Razorpay SDK opens
5. Complete payment → Verify signature → Update due status → Show success

**API Endpoints:**
- `GET /tenants/:tenantId/dues`
- `POST /payments/initiate`
- `POST /payments/verify`

**Razorpay Integration:**

**Step 1: Initiate Payment**
```javascript
// Backend creates Razorpay order
const order = await razorpay.orders.create({
  amount: amount * 100, // paise
  currency: 'INR',
  receipt: `receipt_${tenantDueId}`,
  notes: { tenant_due_id: tenantDueId }
});

// Return order details to app
return {
  order_id: order.id,
  amount: amount,
  currency: 'INR',
  razorpay_key: process.env.RAZORPAY_KEY_ID
};
```

**Step 2: Open Razorpay SDK (Mobile)**
```javascript
const options = {
  key: razorpay_key,
  amount: amount * 100,
  currency: 'INR',
  order_id: order_id,
  name: 'Hostel Management',
  description: 'Rent Payment',
  prefill: {
    name: tenant.full_name,
    email: tenant.email,
    contact: tenant.phone
  },
  theme: { color: '#3399cc' }
};

RazorpayCheckout.open(options)
  .then((data) => {
    // Payment success
    verifyPayment(data.razorpay_order_id, data.razorpay_payment_id, data.razorpay_signature);
  })
  .catch((error) => {
    // Payment failed
    showError(error.description);
  });
```

**Step 3: Verify Payment**
```javascript
// Backend verifies signature
const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
const generated_signature = hmac.digest('hex');

if (generated_signature === razorpay_signature) {
  // Payment verified
  updatePaymentStatus('SUCCESS');
  updateTenantDue({ paid_amount: amount, pending_amount: 0, status: 'PAID' });
  generateReceipt();
  sendReceiptEmail();
} else {
  // Signature mismatch
  updatePaymentStatus('FAILED');
  throw new Error('Payment verification failed');
}
```

**Validation Rules:**
- **Amount**: Must match due's pending_amount
- **Signature**: Must match Razorpay's signature

**Edge Cases:**
1. **Payment Success but Verification Fails**: Mark as PENDING, manual verification by owner
2. **Partial Payment**: Allow, update `paid_amount`, `pending_amount`, `status: PARTIAL`
3. **Overpayment**: Adjust to exact amount, or credit excess to next month
4. **Payment Gateway Down**: Show error, allow retry
5. **Duplicate Payment**: Check if already paid before initiating

**Business Logic:**
- Create payment record with `status: PENDING`
- On verification success:
  - Update payment `status: SUCCESS`
  - Update due `paid_amount`, `pending_amount`, `status: PAID`
  - Generate receipt PDF (store in S3)
  - Send receipt via email
  - Send push notification "Payment successful"

---

### **6.3 Offline Payment Recording (Owner)**

**Screen Purpose:**
Allow owner to record cash/bank transfer payments.

**UI Flow:**
1. Owner navigates to Tenant Detail → "Record Payment"
2. Form:
   - Select Due (dropdown of pending dues)
   - Amount
   - Payment Method (Cash/Bank Transfer/UPI)
   - Transaction Date
   - Notes
3. Submit → Payment recorded

**API Endpoints:**
- `POST /payments/offline`

**Validation Rules:**
- **Amount**: Positive, <= pending_amount
- **Transaction Date**: <= today

**Edge Cases:**
1. **Partial Offline Payment**: Allow, update due accordingly
2. **Future-dated Payment**: Prevent, must be <= today
3. **Receipt Generation**: Auto-generate receipt number

**Business Logic:**
- Create payment record with `status: SUCCESS`
- Update due's `paid_amount`, `pending_amount`
- Generate receipt
- Send receipt to tenant via email/SMS

---

### **6.4 Late Fee Calculation**

**Background Job:**
Runs daily at 9:00 AM.

**Logic:**
```javascript
// For each overdue due
for (due of overdues) {
  const daysOverdue = daysSince(due.due_date);
  
  if (daysOverdue > 0 && due.status !== 'PAID') {
    const lateFeePercentage = getSystemConfig('LATE_FEE_PERCENTAGE'); // 5%
    const lateFee = (due.rent_amount * lateFeePercentage / 100);
    
    updateTenantDue({
      late_fee: lateFee,
      total_amount: due.rent_amount + due.food_charges + lateFee,
      pending_amount: due.total_amount - due.paid_amount,
      status: 'OVERDUE'
    });
    
    // Send overdue notification
    sendNotification(tenant, 'PAYMENT_OVERDUE', `Your payment is ${daysOverdue} days overdue. Late fee of ₹${lateFee} applied.`);
  }
}
```

---

### **6.5 Payment Reminders**

**Background Job:**
Runs daily at 9:00 AM.

**Logic:**
```javascript
const reminderDays = getSystemConfig('PAYMENT_REMINDER_DAYS'); // 3 days

// For each upcoming due
for (due of upcomingDues) {
  const daysUntilDue = daysUntil(due.due_date);
  
  if (daysUntilDue === reminderDays && due.status === 'PENDING') {
    sendNotification(tenant, 'PAYMENT_DUE', `Your rent of ₹${due.total_amount} is due on ${formatDate(due.due_date)}`);
    sendSMS(tenant.phone, `Reminder: Rent due on ${formatDate(due.due_date)}`);
  }
}
```

---

## Module 7: Dashboard & Analytics

### **7.1 Owner Dashboard**

**Screen Purpose:**
Provide at-a-glance overview of hostel operations.

**UI Components:**

**Summary Cards (2x2 grid):**
1. Total Hostels (count)
2. Occupancy Rate (percentage)
3. Monthly Revenue (₹)
4. Pending Dues (₹)

**Recent Payments (List):**
- Last 5 payments
- Each item: Tenant name, Amount, Date, Status

**Upcoming Dues (List):**
- Next 7 days
- Each item: Tenant name, Amount, Due date, Days remaining

**Quick Actions (FAB):**
- Add Hostel
- Add Tenant
- Record Payment

**API Endpoints:**
- `GET /dashboard/owner`

**Response:**
```json
{
  "summary": {
    "total_hostels": 3,
    "total_beds": 150,
    "occupied_beds": 120,
    "available_beds": 30,
    "occupancy_rate": 80,
    "active_tenants": 120,
    "pending_dues": 45000,
    "monthly_revenue": 960000
  },
  "recent_payments": [...],
  "upcoming_dues": [...]
}
```

---

### **7.2 Hostel Analytics**

**Screen Purpose:**
Detailed analytics for individual hostel.

**UI Components:**

**Revenue Trend (Line Chart):**
- Last 6 months
- X-axis: Months
- Y-axis: Revenue (₹)

**Occupancy Trend (Line Chart):**
- Last 6 months
- X-axis: Months
- Y-axis: Occupancy %

**Payment Collection Rate (Donut Chart):**
- Paid on time: 85%
- Paid late: 10%
- Pending: 5%

**Top Revenue Rooms (Bar Chart):**
- Top 5 rooms by revenue

**API Endpoints:**
- `GET /hostels/:hostelId/analytics?period=6months`

**Edge Cases:**
1. **Insufficient Data**: Show "Not enough data" for new hostels
2. **No Payments**: Show 0 revenue

---

## Module 8: Announcements & Notifications

### **8.1 Create Announcement**

**Screen Purpose:**
Broadcast messages to tenants.

**UI Flow:**
1. Owner navigates to Hostel Detail → "Announcements"
2. Tap "New Announcement"
3. Form:
   - Title
   - Message
   - Priority (Low/Normal/High/Urgent)
   - Target Audience (All/Tenants/Specific)
   - Valid From/To (optional)
4. Submit → Announcement created → Push notifications sent

**API Endpoints:**
- `POST /hostels/:hostelId/announcements`
- `GET /hostels/:hostelId/announcements`

**Validation Rules:**
- **Title**: 3-255 chars, required
- **Message**: Required, max 1000 chars
- **Priority**: One of [LOW, NORMAL, HIGH, URGENT]
- **Target Audience**: One of [ALL, TENANTS, SPECIFIC]
- **Valid To**: >= Valid From

**Edge Cases:**
1. **Specific Tenants**: Show multi-select list of tenants
2. **Scheduled Announcement**: Set `valid_from` to future date
3. **Expired Announcement**: Auto-hide when `valid_to` passed

**Business Logic:**
- Create announcement record
- Send push notifications to targeted users via FCM
- Create notification records for each user
- High/Urgent priority: Send SMS as well

---

### **8.2 View Announcements (Tenant)**

**Screen Purpose:**
Display hostel announcements for tenants.

**UI Components:**
- List of announcements (sorted by priority, then date)
- Each item: Title, Message preview, Priority badge, Date
- Tap to expand full message

**API Endpoints:**
- `GET /hostels/:hostelId/announcements?active_only=true`

**Edge Cases:**
1. **No Announcements**: Show "No announcements"
2. **Urgent Announcements**: Show at top with red badge

---

### **8.3 Push Notifications**

**Implementation:**

**FCM Integration:**
1. User logs in → Store FCM token in `refresh_tokens` table
2. On notification event → Send via FCM

**Notification Types:**
- `PAYMENT_DUE`: Rent due reminder
- `PAYMENT_SUCCESS`: Payment confirmed
- `ANNOUNCEMENT`: New announcement
- `BOOKING_CONFIRMED`: Guest booking confirmed
- `GENERAL`: General notifications

**API Endpoints:**
- `GET /notifications`
- `PATCH /notifications/:notificationId/read`
- `DELETE /notifications/:notificationId`

**Business Logic:**
```javascript
async function sendPushNotification(userId, title, message, type, relatedEntityId) {
  // Get user's FCM tokens (may have multiple devices)
  const tokens = await getUserFCMTokens(userId);
  
  // Create notification record
  const notification = await createNotification({
    user_id: userId,
    title,
    message,
    notification_type: type,
    related_entity_id: relatedEntityId
  });
  
  // Send via FCM
  const fcmPayload = {
    notification: { title, body: message },
    data: { notification_id: notification.uuid, type }
  };
  
  await admin.messaging().sendMulticast({
    tokens,
    ...fcmPayload
  });
}
```

---

## Module 9: Guest Booking System

### **9.1 Search Hostels**

**Screen Purpose:**
Allow guests to discover hostels for short stays.

**UI Flow:**
1. Guest opens Search tab
2. Enter city, select dates (check-in, check-out)
3. Tap "Search"
4. Results displayed with filters

**API Endpoints:**
- `GET /hostels/search?city=Bangalore&check_in=2026-02-10&check_out=2026-02-11&hostel_type=BOYS&min_price=300&max_price=700`

**Search Logic:**
```sql
SELECT h.*, 
       COUNT(b.id) AS available_beds
FROM hostels h
LEFT JOIN beds b ON h.id = b.hostel_id 
  AND b.status = 'AVAILABLE'
  AND b.id NOT IN (
    SELECT bed_id FROM bookings 
    WHERE status IN ('CONFIRMED', 'CHECKED_IN')
      AND (
        (check_in_date <= '2026-02-10' AND check_out_date > '2026-02-10')
        OR (check_in_date < '2026-02-11' AND check_out_date >= '2026-02-11')
        OR (check_in_date >= '2026-02-10' AND check_out_date <= '2026-02-11')
      )
  )
WHERE h.city = 'Bangalore'
  AND h.is_active = 1
  AND h.allow_guest_bookings = 1
  AND h.daily_rate BETWEEN 300 AND 700
GROUP BY h.id
HAVING available_beds > 0
ORDER BY h.daily_rate ASC;
```

**Validation Rules:**
- **City**: Required
- **Check-in Date**: >= today
- **Check-out Date**: > check-in date
- **Date Range**: <= MAX_BOOKING_DAYS (system config, default 7)

**Edge Cases:**
1. **No Results**: Show "No hostels found. Try different dates/city."
2. **Invalid Date Range**: Show error "Check-out must be after check-in"
3. **Exceeds Max Days**: Show error "Maximum booking duration is 7 days"

---

### **9.2 Create Booking**

**Screen Purpose:**
Book a bed for short stay.

**UI Flow:**
1. From Search Results → Tap hostel → Hostel Detail
2. Tap "Book Now" → Select Dates
3. Enter Guest Info (pre-filled from profile)
4. Review booking summary
5. Tap "Pay ₹500" → Razorpay
6. Payment success → Booking confirmed

**API Endpoints:**
- `POST /bookings`
- `POST /payments/verify` (same as rent payment)

**Validation Rules:**
- **Bed Availability**: Check bed is available for all dates in range
- **Concurrent Bookings**: Use database transaction to prevent race condition
- **Guest Info**: Name, Phone required

**Edge Cases:**
1. **Bed Booked Between Selection and Payment**: Show error "Bed no longer available"
2. **Payment Failure**: Booking status remains PENDING, allow retry
3. **Booking Expiry**: Auto-cancel PENDING bookings after 30 minutes

**Business Logic:**
```javascript
// Transaction to prevent race condition
await sequelize.transaction(async (t) => {
  // Check bed availability
  const conflictingBookings = await Booking.findAll({
    where: {
      bed_id: bedId,
      status: ['CONFIRMED', 'CHECKED_IN'],
      [Op.or]: [
        { check_in_date: { [Op.lte]: checkInDate }, check_out_date: { [Op.gt]: checkInDate } },
        { check_in_date: { [Op.lt]: checkOutDate }, check_out_date: { [Op.gte]: checkOutDate } },
        { check_in_date: { [Op.gte]: checkInDate }, check_out_date: { [Op.lte]: checkOutDate } }
      ]
    },
    transaction: t
  });
  
  if (conflictingBookings.length > 0) {
    throw new Error('Bed not available for selected dates');
  }
  
  // Create booking
  const booking = await Booking.create({
    guest_id: userId,
    hostel_id: hostelId,
    bed_id: bedId,
    check_in_date: checkInDate,
    check_out_date: checkOutDate,
    number_of_days: numberOfDays,
    daily_rate: dailyRate,
    total_amount: totalAmount,
    status: 'PENDING'
  }, { transaction: t });
  
  // Create Razorpay order
  const order = await createRazorpayOrder(totalAmount, booking.id);
  
  return { booking, order };
});
```

---

### **9.3 Booking Management**

**Screen Purpose:**
View and manage bookings.

**UI Components:**
- Tabs: Upcoming, Past
- Each booking card: Hostel name, Dates, Status, Amount
- Tap to view details

**API Endpoints:**
- `GET /bookings` (user's bookings)
- `GET /bookings/:bookingId`
- `POST /bookings/:bookingId/cancel`

**Cancellation Policy:**
- Free cancellation up to 24 hours before check-in
- 50% refund if cancelled within 24 hours
- No refund after check-in

**Business Logic:**
```javascript
async function cancelBooking(bookingId, userId) {
  const booking = await Booking.findOne({ where: { id: bookingId, guest_id: userId } });
  
  if (booking.status === 'CHECKED_IN' || booking.status === 'CHECKED_OUT') {
    throw new Error('Cannot cancel after check-in');
  }
  
  const hoursUntilCheckIn = hoursBetween(new Date(), booking.check_in_date);
  let refundAmount = 0;
  
  if (hoursUntilCheckIn >= 24) {
    refundAmount = booking.total_amount; // 100% refund
  } else if (hoursUntilCheckIn > 0) {
    refundAmount = booking.total_amount * 0.5; // 50% refund
  }
  
  // Process refund via Razorpay
  if (refundAmount > 0 && booking.payment_id) {
    await razorpay.payments.refund(booking.payment_id, {
      amount: refundAmount * 100
    });
  }
  
  // Update booking
  await booking.update({
    status: 'CANCELLED',
    cancelled_at: new Date(),
    refund_amount: refundAmount
  });
  
  // Send notification
  sendNotification(userId, 'BOOKING_CANCELLED', `Booking cancelled. Refund: ₹${refundAmount}`);
}
```

---

## Module 10: Admin Configuration

### **10.1 System Configuration**

**Screen Purpose:**
Manage system-wide settings (Admin only).

**UI Components:**
- List of config items
- Each item: Key, Value, Description, Edit button

**API Endpoints:**
- `GET /admin/config`
- `PATCH /admin/config`

**Configuration Items:**
- `PAYMENT_GATEWAY`: Razorpay/Stripe
- `LATE_FEE_PERCENTAGE`: 5
- `PAYMENT_REMINDER_DAYS`: 3
- `MAX_BOOKING_DAYS`: 7
- `OTP_EXPIRY_MINUTES`: 5
- `ACCESS_TOKEN_EXPIRY_MINUTES`: 15
- `REFRESH_TOKEN_EXPIRY_DAYS`: 7

**Validation Rules:**
- **Numeric Values**: Must be positive
- **Percentage Values**: 0-100

**Edge Cases:**
1. **Invalid Config Value**: Show error with expected format
2. **Critical Config Change**: Require confirmation (e.g., changing payment gateway)

---

This completes the comprehensive module-wise feature breakdown. Next, I'll create the sprint-ready task breakdown.
