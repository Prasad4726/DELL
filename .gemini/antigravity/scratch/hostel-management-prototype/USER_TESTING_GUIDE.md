# User Testing Guide - Hostel Management App

## 🎯 Testing Objective
Test the frontend prototype as a real user would interact with the application, evaluating usability, design, and user experience.

---

## 👤 Test Scenario 1: Hostel Owner Journey

### **User Profile**
- **Name**: Rajesh Kumar
- **Role**: Hostel Owner
- **Goal**: Manage 3 hostels in Bangalore, track payments, and onboard new tenants

### **Step-by-Step Testing**

#### **1. First Launch (0:00 - 0:02)**
✅ **What to observe:**
- Splash screen appears with animated logo
- Purple gradient background
- Logo bounces smoothly
- Loading spinner rotates
- Screen auto-transitions after 2 seconds

📝 **Check:**
- [ ] Animation is smooth (no lag)
- [ ] Logo is clearly visible
- [ ] Branding looks professional

---

#### **2. Onboarding Experience (0:02 - 0:15)**
✅ **What to do:**
- Watch the carousel auto-advance through 3 slides
- Read each slide's content
- Click the slide indicators to jump between slides
- Click "Get Started" button

📝 **Check:**
- [ ] Slides transition smoothly every 3 seconds
- [ ] Content is clear and compelling
- [ ] Icons are relevant to the message
- [ ] Indicators update correctly
- [ ] "Get Started" button is prominent

**Expected Slides:**
1. "Manage Your Hostel Effortlessly"
2. "Track Payments & Tenants"
3. "Find Short Stays Anywhere"

---

#### **3. Role Selection (0:15 - 0:20)**
✅ **What to do:**
- Hover over each role card
- Read the features listed
- Click on "Hostel Owner" card

📝 **Check:**
- [ ] Cards have hover effect (lift up, shadow increases)
- [ ] Icons are clear and appropriate
- [ ] Feature lists are helpful
- [ ] Click is responsive

---

#### **4. Login (0:20 - 0:30)**
✅ **What to do:**
1. Enter email: `owner@hostel.com`
2. Enter password: `Test@123`
3. Click the eye icon to toggle password visibility
4. Click "Login" button
5. Watch for success notification

📝 **Check:**
- [ ] Input fields are easy to use
- [ ] Icons inside inputs are visible
- [ ] Password toggle works (eye icon changes)
- [ ] Login button has hover effect
- [ ] Green success notification appears
- [ ] Notification auto-dismisses after 3 seconds
- [ ] Smooth transition to dashboard

---

#### **5. Owner Dashboard - First Impression (0:30 - 1:00)**
✅ **What to observe:**
- Header with greeting "Hello, Rajesh 👋"
- Notification bell with badge (3 notifications)
- 4 summary cards in 2x2 grid
- Recent payments section
- Upcoming dues section
- Bottom navigation with 5 tabs
- Purple floating action button (+)

📝 **Check:**
- [ ] All data is clearly visible
- [ ] Cards have appropriate colors
- [ ] Icons match the data type
- [ ] Layout is clean and organized
- [ ] No text overflow or alignment issues

**Verify Summary Cards:**
- Total Hostels: 3
- Occupancy: 80%
- Monthly Revenue: ₹9.6L
- Pending Dues: ₹45K

---

#### **6. Explore Recent Payments (1:00 - 1:15)**
✅ **What to do:**
- Scroll through the recent payments list
- Read payment details
- Click "View All" link

📝 **Check:**
- [ ] Payment items are clearly formatted
- [ ] Avatar icons are visible
- [ ] Names and dates are readable
- [ ] Amounts are in green (success color)
- [ ] Timestamps are relative (Today, Yesterday, etc.)

**Expected Payments:**
1. Amit Sharma - ₹8,000 (Today, 10:30 AM)
2. Priya Singh - ₹10,500 (Yesterday, 3:15 PM)
3. Rahul Kumar - ₹7,500 (2 days ago)

---

#### **7. Check Upcoming Dues (1:15 - 1:30)**
✅ **What to observe:**
- List of tenants with upcoming payments
- Due dates displayed
- Amounts in orange (pending color)

📝 **Check:**
- [ ] Due dates are clear
- [ ] Amounts are prominent
- [ ] Color coding makes sense

**Expected Dues:**
1. Vikram Patel - ₹9,000 (Due in 2 days)
2. Sneha Reddy - ₹8,500 (Due in 5 days)

---

#### **8. Test Floating Action Button (1:30 - 1:45)**
✅ **What to do:**
1. Click the purple + button (bottom right)
2. Observe the quick actions modal
3. Read the action options
4. Click outside the modal to close it

📝 **Check:**
- [ ] FAB has hover effect (scales up)
- [ ] Modal slides up from bottom
- [ ] Background overlay is semi-transparent
- [ ] Action buttons are clear
- [ ] Modal closes when clicking overlay

**Expected Actions:**
- Add Hostel
- Add Tenant
- Record Payment

---

#### **9. Navigate to Hostels Tab (1:45 - 2:15)**
✅ **What to do:**
1. Click "Hostels" tab in bottom navigation
2. Observe the screen transition
3. Scroll through hostel cards
4. Hover over hostel cards

📝 **Check:**
- [ ] Tab highlights correctly (turns purple)
- [ ] Screen transitions smoothly
- [ ] Header shows "My Hostels"
- [ ] Add button (+) is visible in header
- [ ] Hostel cards display properly

**For Each Hostel Card, Verify:**
- [ ] Image loads and looks good
- [ ] "Active" badge is visible
- [ ] Hostel name is clear
- [ ] Location with icon is shown
- [ ] Statistics are in 3 columns (Total/Occupied/Available)
- [ ] Revenue is displayed at bottom
- [ ] Card has hover effect (lifts up)

**Expected Hostels:**
1. **Green Valley Boys Hostel**
   - Location: Bangalore, Karnataka
   - Total Beds: 50 | Occupied: 35 | Available: 15
   - Revenue: ₹2,80,000

2. **Sunrise Girls Hostel**
   - Location: Bangalore, Karnataka
   - Total Beds: 40 | Occupied: 38 | Available: 2
   - Revenue: ₹3,80,000

---

#### **10. Test Bottom Navigation (2:15 - 2:45)**
✅ **What to do:**
1. Click each tab in bottom navigation
2. Observe which tab highlights
3. Return to Dashboard

📝 **Check:**
- [ ] Each tab click is responsive
- [ ] Active tab changes color to purple
- [ ] Inactive tabs are gray
- [ ] Icons are clear and appropriate
- [ ] Labels are readable

**Tabs to Test:**
1. Dashboard (home icon)
2. Hostels (building icon)
3. Tenants (users icon)
4. Payments (wallet icon)
5. Profile (user-circle icon)

---

## 👤 Test Scenario 2: Tenant Journey

### **User Profile**
- **Name**: Amit Sharma
- **Role**: Tenant
- **Goal**: Check bed details, view food menu, and pay rent

### **Step-by-Step Testing**

#### **1. Start Fresh (0:00)**
✅ **What to do:**
- Refresh the page (F5)
- Wait for splash screen
- Click through onboarding
- Select "Tenant" role
- Login with any credentials

---

#### **2. Tenant Home Screen (0:30 - 1:30)**
✅ **What to observe:**
- Welcome message with name
- Bed information card
- Hostel information card
- Payment due alert (orange warning)
- Announcements section
- Bottom navigation (4 tabs)

📝 **Check:**
- [ ] All cards are clearly separated
- [ ] Icons are relevant
- [ ] Information is well-organized
- [ ] Alert stands out visually

**Verify Bed Information:**
- Bed Number: 101-A
- Room Number: 101
- Floor: First Floor
- Room Type: Double Sharing
- Amenities: AC, Attached Bath, WiFi

**Verify Hostel Information:**
- Name: Green Valley Boys Hostel
- Address: 123 MG Road, Near Metro Station, Bangalore
- Contact buttons: Call, Email

**Verify Payment Alert:**
- Amount: ₹10,500
- Due Date: 01-Mar-2026
- "Pay Now" button is prominent

---

#### **3. Check Announcements (1:30 - 2:00)**
✅ **What to observe:**
- 2 announcements with different priorities
- High priority (red) and Normal priority (blue)
- Timestamps

📝 **Check:**
- [ ] Priority badges are color-coded
- [ ] Icons match priority level
- [ ] Content is readable
- [ ] Timestamps are clear

**Expected Announcements:**
1. **Water Supply Maintenance** (High Priority - Red)
   - "Water supply will be interrupted on Sunday..."
   - Today, 9:00 AM

2. **New Food Menu** (Normal Priority - Blue)
   - "Updated weekly menu is now available..."
   - Yesterday

---

#### **4. Test Bottom Navigation (2:00 - 2:30)**
✅ **What to do:**
- Click through all 4 tabs
- Observe active states

**Tabs:**
1. Home (house icon)
2. Dues (invoice icon)
3. Food Menu (utensils icon)
4. Profile (user icon)

---

## 👤 Test Scenario 3: Guest Journey

### **User Profile**
- **Name**: Priya Singh
- **Role**: Guest
- **Goal**: Find and book a hostel in Bangalore for 1 night

### **Step-by-Step Testing**

#### **1. Start Fresh (0:00)**
✅ **What to do:**
- Refresh page
- Skip through onboarding
- Select "Guest" role
- Login

---

#### **2. Search Hostels (0:30 - 1:30)**
✅ **What to observe:**
- Search form at top
- City input with location icon
- Date pickers for check-in/check-out
- Search button
- Search results below

📝 **Check:**
- [ ] Form is easy to understand
- [ ] Date inputs work properly
- [ ] Search button is prominent
- [ ] Results are displayed as cards

**Verify Search Form:**
- City: Bangalore (pre-filled)
- Check-in: 2026-02-10
- Check-out: 2026-02-11
- Search button with icon

---

#### **3. Review Search Results (1:30 - 2:30)**
✅ **What to do:**
- Scroll through hostel results
- Hover over result cards
- Read all details

📝 **Check for Each Result:**
- [ ] Image is clear and attractive
- [ ] Rating badge is visible (top-right)
- [ ] Hostel name is prominent
- [ ] Location with distance is shown
- [ ] Amenity icons are displayed
- [ ] Price is large and clear
- [ ] Available beds count is shown
- [ ] Card has hover effect

**Expected Results:**

**1. Green Valley Boys Hostel**
- Rating: 4.5 stars
- Location: Bangalore • 2.3 km away
- Amenities: WiFi, AC, Parking, Security
- Price: ₹500/night
- Available: 5 beds

**2. Sunrise Girls Hostel**
- Rating: 4.7 stars
- Location: Bangalore • 3.1 km away
- Amenities: WiFi, AC, Food, Gym
- Price: ₹600/night
- Available: 2 beds

---

#### **4. Test Bottom Navigation (2:30 - 3:00)**
✅ **What to do:**
- Click through all 3 tabs

**Tabs:**
1. Search (magnifying glass)
2. Bookings (calendar icon)
3. Profile (user icon)

---

## 🎨 Design Quality Assessment

### **Visual Design**
Rate each aspect (1-5 stars):

- [ ] **Color Scheme**: Purple gradients are appealing
- [ ] **Typography**: Text is readable and well-sized
- [ ] **Spacing**: Elements have proper breathing room
- [ ] **Icons**: Icons are clear and meaningful
- [ ] **Images**: Hostel images look professional
- [ ] **Consistency**: Design is consistent across screens

### **User Experience**
Rate each aspect (1-5 stars):

- [ ] **Navigation**: Easy to move between screens
- [ ] **Clarity**: Purpose of each screen is clear
- [ ] **Feedback**: Actions provide visual feedback
- [ ] **Speed**: Transitions are smooth and fast
- [ ] **Intuitiveness**: No confusion about what to do
- [ ] **Mobile Feel**: Feels like a real mobile app

### **Animations & Interactions**
Check all that work:

- [ ] Splash screen logo bounce
- [ ] Onboarding slide transitions
- [ ] Card hover effects (lift + shadow)
- [ ] Button hover effects
- [ ] Tab active state changes
- [ ] Modal slide-up animation
- [ ] Notification toast animation
- [ ] Password toggle works
- [ ] Form validation feedback

---

## 🐛 Bug Reporting

If you find any issues, note them here:

### **Visual Bugs**
- [ ] Text overflow
- [ ] Misaligned elements
- [ ] Broken images
- [ ] Color contrast issues
- [ ] Spacing problems

### **Functional Bugs**
- [ ] Navigation doesn't work
- [ ] Buttons don't respond
- [ ] Forms don't validate
- [ ] Animations are choppy
- [ ] Modal doesn't close

### **Browser Compatibility**
Test in different browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if available)

---

## 📊 Overall Assessment

### **Strengths** (What works well?)
1. _______________________________
2. _______________________________
3. _______________________________

### **Weaknesses** (What needs improvement?)
1. _______________________________
2. _______________________________
3. _______________________________

### **Suggestions** (What would make it better?)
1. _______________________________
2. _______________________________
3. _______________________________

### **Final Rating**
Overall Prototype Quality: ⭐⭐⭐⭐⭐ (1-5 stars)

---

## ✅ Testing Checklist Summary

**Completed Scenarios:**
- [ ] Hostel Owner Journey (10 steps)
- [ ] Tenant Journey (4 steps)
- [ ] Guest Journey (4 steps)

**Total Testing Time:** ~10-15 minutes

**Ready for Development:** Yes / No / Needs Changes

---

**Tester Name**: _______________________  
**Date**: _______________________  
**Browser**: _______________________  
**Screen Size**: _______________________
