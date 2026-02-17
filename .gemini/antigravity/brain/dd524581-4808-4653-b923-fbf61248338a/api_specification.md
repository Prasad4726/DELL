# API Specification - Hostel Management Application

## 1. Overview

RESTful API specification for the Hostel Management Application. All endpoints follow REST conventions with JSON request/response format.

**Base URL**: `https://api.hostelmanagement.com/api/v1`

**Authentication**: JWT Bearer token (except public endpoints)

**Rate Limiting**: 100 requests per 15 minutes per IP

---

## 2. API Conventions

### **2.1 Request Headers**

```http
Content-Type: application/json
Authorization: Bearer <access_token>
X-Device-Type: iOS | Android
X-App-Version: 1.0.0
```

### **2.2 Response Format**

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-02-03T20:30:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2026-02-03T20:30:00Z"
}
```

### **2.3 HTTP Status Codes**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

### **2.4 Pagination**

```http
GET /api/v1/hostels?page=1&limit=20&sort=created_at&order=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 100,
      "items_per_page": 20,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

## 3. Authentication Endpoints

### **3.1 Register User**

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request:**
```json
{
  "email": "user@example.com",
  "phone": "+919876543210",
  "password": "SecurePass@123",
  "full_name": "Rajesh Kumar",
  "role": "OWNER"
}
```

**Validation:**
- `email`: Valid email format, unique
- `phone`: Valid phone with country code, unique
- `password`: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- `role`: One of ['OWNER', 'TENANT', 'GUEST']

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "email": "user@example.com",
      "phone": "+919876543210",
      "full_name": "Rajesh Kumar",
      "role": "OWNER",
      "email_verified": false,
      "phone_verified": false
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_in": 900
    }
  },
  "message": "Registration successful"
}
```

**Edge Cases:**
- Duplicate email/phone → 409 Conflict
- Invalid role → 400 Bad Request
- Weak password → 400 Bad Request

---

### **3.2 Login**

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "device_type": "Android",
  "device_id": "device_unique_id",
  "fcm_token": "fcm_token_for_push_notifications"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "email": "user@example.com",
      "full_name": "Rajesh Kumar",
      "role": "OWNER",
      "profile_image_url": "https://cdn.example.com/profile.jpg"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_in": 900
    }
  }
}
```

**Edge Cases:**
- Invalid credentials → 401 Unauthorized
- Account suspended → 403 Forbidden
- Too many failed attempts → 429 Rate Limited

---

### **3.3 Refresh Token**

**Endpoint:** `POST /auth/refresh`

**Access:** Public

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900
  }
}
```

---

### **3.4 Logout**

**Endpoint:** `POST /auth/logout`

**Access:** Authenticated

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 4. Hostel Management Endpoints (Owner)

### **4.1 Create Hostel**

**Endpoint:** `POST /hostels`

**Access:** Owner only

**Request:**
```json
{
  "name": "Green Valley Boys Hostel",
  "description": "Comfortable hostel near IT park with modern amenities",
  "hostel_type": "BOYS",
  "address_line1": "123 MG Road",
  "address_line2": "Near Metro Station",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "contact_phone": "+919876543210",
  "contact_email": "contact@greenvalley.com",
  "amenities": ["WiFi", "Laundry", "AC", "Parking", "Security", "CCTV"],
  "monthly_rent_min": 5000,
  "monthly_rent_max": 12000,
  "daily_rate": 500,
  "food_included": true,
  "allow_guest_bookings": true
}
```

**Validation:**
- `name`: Required, 3-255 chars
- `hostel_type`: One of ['BOYS', 'GIRLS', 'CO_ED']
- `city`, `state`, `pincode`: Required
- `latitude`, `longitude`: Valid coordinates
- `monthly_rent_min` <= `monthly_rent_max`
- `daily_rate`: Required if `allow_guest_bookings` is true

**Response (201):**
```json
{
  "success": true,
  "data": {
    "hostel": {
      "uuid": "h1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Green Valley Boys Hostel",
      "hostel_type": "BOYS",
      "city": "Bangalore",
      "state": "Karnataka",
      "amenities": ["WiFi", "Laundry", "AC", "Parking", "Security", "CCTV"],
      "monthly_rent_min": 5000,
      "monthly_rent_max": 12000,
      "daily_rate": 500,
      "created_at": "2026-02-03T20:30:00Z"
    }
  },
  "message": "Hostel created successfully"
}
```

---

### **4.2 Get Owner's Hostels**

**Endpoint:** `GET /hostels/my-hostels`

**Access:** Owner only

**Query Params:** `?page=1&limit=10`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "uuid": "h1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Green Valley Boys Hostel",
        "city": "Bangalore",
        "total_beds": 50,
        "occupied_beds": 35,
        "available_beds": 15,
        "monthly_revenue": 280000,
        "is_active": true
      }
    ],
    "pagination": { ... }
  }
}
```

---

### **4.3 Get Hostel Details**

**Endpoint:** `GET /hostels/:hostelId`

**Access:** Owner (own hostels), Guest (public)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "hostel": {
      "uuid": "h1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Green Valley Boys Hostel",
      "description": "Comfortable hostel near IT park",
      "hostel_type": "BOYS",
      "address": {
        "line1": "123 MG Road",
        "line2": "Near Metro Station",
        "city": "Bangalore",
        "state": "Karnataka",
        "pincode": "560001"
      },
      "location": {
        "latitude": 12.9716,
        "longitude": 77.5946
      },
      "contact": {
        "phone": "+919876543210",
        "email": "contact@greenvalley.com"
      },
      "amenities": ["WiFi", "Laundry", "AC", "Parking"],
      "images": [
        "https://cdn.example.com/hostel1.jpg",
        "https://cdn.example.com/hostel2.jpg"
      ],
      "pricing": {
        "monthly_rent_min": 5000,
        "monthly_rent_max": 12000,
        "daily_rate": 500
      },
      "stats": {
        "total_beds": 50,
        "available_beds": 15,
        "occupancy_rate": 70
      },
      "food_included": true,
      "allow_guest_bookings": true
    }
  }
}
```

---

### **4.4 Update Hostel**

**Endpoint:** `PATCH /hostels/:hostelId`

**Access:** Owner only (own hostels)

**Request:**
```json
{
  "name": "Green Valley Premium Hostel",
  "daily_rate": 600,
  "amenities": ["WiFi", "Laundry", "AC", "Parking", "Gym"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "hostel": { ... }
  },
  "message": "Hostel updated successfully"
}
```

---

### **4.5 Upload Hostel Images**

**Endpoint:** `POST /hostels/:hostelId/images`

**Access:** Owner only

**Content-Type:** `multipart/form-data`

**Request:**
```
images: [File, File, File] (max 10 images, 5MB each)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uploaded_images": [
      "https://cdn.example.com/hostel_123_1.jpg",
      "https://cdn.example.com/hostel_123_2.jpg"
    ]
  }
}
```

---

## 5. Room & Bed Management Endpoints

### **5.1 Create Floor**

**Endpoint:** `POST /hostels/:hostelId/floors`

**Access:** Owner only

**Request:**
```json
{
  "floor_number": 1,
  "floor_name": "First Floor"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "floor": {
      "uuid": "f1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "floor_number": 1,
      "floor_name": "First Floor"
    }
  }
}
```

---

### **5.2 Create Room**

**Endpoint:** `POST /hostels/:hostelId/floors/:floorId/rooms`

**Access:** Owner only

**Request:**
```json
{
  "room_number": "101",
  "room_name": "Deluxe Room 101",
  "room_type": "DOUBLE",
  "total_beds": 2,
  "has_ac": true,
  "has_attached_bathroom": true,
  "amenities": ["AC", "Attached Bathroom", "Balcony"],
  "rent_per_bed": 8000
}
```

**Validation:**
- `room_type`: One of ['SINGLE', 'DOUBLE', 'TRIPLE', 'QUAD', 'DORMITORY']
- `total_beds`: Must match room_type (SINGLE=1, DOUBLE=2, etc.)
- `rent_per_bed`: Required, positive number

**Response (201):**
```json
{
  "success": true,
  "data": {
    "room": {
      "uuid": "r1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "room_number": "101",
      "room_type": "DOUBLE",
      "total_beds": 2,
      "rent_per_bed": 8000,
      "beds": [
        {
          "uuid": "b1b2c3d4-e5f6-7890-abcd-ef1234567890",
          "bed_number": "101-A",
          "status": "AVAILABLE"
        },
        {
          "uuid": "b2b2c3d4-e5f6-7890-abcd-ef1234567890",
          "bed_number": "101-B",
          "status": "AVAILABLE"
        }
      ]
    }
  },
  "message": "Room and beds created successfully"
}
```

**Edge Cases:**
- Duplicate room number in hostel → 409 Conflict
- Invalid room_type → 400 Bad Request

---

### **5.3 Get Available Beds**

**Endpoint:** `GET /hostels/:hostelId/beds/available`

**Access:** Owner, Guest

**Query Params:** `?floor=1&room_type=DOUBLE`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "available_beds": [
      {
        "bed_uuid": "b1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "bed_number": "101-A",
        "floor_number": 1,
        "room_number": "101",
        "room_type": "DOUBLE",
        "has_ac": true,
        "has_attached_bathroom": true,
        "rent": 8000,
        "amenities": ["AC", "Attached Bathroom", "Balcony"]
      }
    ],
    "total_available": 15
  }
}
```

---

### **5.4 Update Bed Status**

**Endpoint:** `PATCH /beds/:bedId/status`

**Access:** Owner only

**Request:**
```json
{
  "status": "MAINTENANCE"
}
```

**Validation:**
- `status`: One of ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE']
- Cannot set to OCCUPIED manually (handled via tenant assignment)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "bed": {
      "uuid": "b1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "bed_number": "101-A",
      "status": "MAINTENANCE"
    }
  }
}
```

---

## 6. Tenant Management Endpoints

### **6.1 Onboard Tenant**

**Endpoint:** `POST /hostels/:hostelId/tenants`

**Access:** Owner only

**Content-Type:** `multipart/form-data`

**Request:**
```
full_name: "Amit Sharma"
email: "amit@example.com"
phone: "+919876543211"
bed_id: "b1b2c3d4-e5f6-7890-abcd-ef1234567890"
aadhaar_number: "123456789012"
aadhaar_image: File (max 5MB, jpg/png/pdf)
photo: File (max 2MB, jpg/png)
emergency_contact_name: "Ramesh Sharma"
emergency_contact_phone: "+919876543200"
emergency_contact_relation: "Father"
joining_date: "2026-02-10"
monthly_rent: 8000
security_deposit: 16000
advance_paid: 8000
```

**Validation:**
- `bed_id`: Must be AVAILABLE
- `aadhaar_number`: 12 digits, unique
- `joining_date`: Cannot be in past
- `monthly_rent`: Positive number
- `security_deposit`: Typically 2x monthly rent
- `phone`: Valid, unique

**Response (201):**
```json
{
  "success": true,
  "data": {
    "tenant": {
      "uuid": "t1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "full_name": "Amit Sharma",
      "email": "amit@example.com",
      "phone": "+919876543211",
      "bed_number": "101-A",
      "room_number": "101",
      "joining_date": "2026-02-10",
      "monthly_rent": 8000,
      "security_deposit": 16000,
      "status": "ACTIVE",
      "aadhaar_image_url": "https://s3.amazonaws.com/encrypted/aadhaar_123.jpg",
      "photo_url": "https://s3.amazonaws.com/photos/tenant_123.jpg"
    }
  },
  "message": "Tenant onboarded successfully. Welcome SMS sent."
}
```

**Edge Cases:**
- Bed already occupied → 409 Conflict
- Duplicate Aadhaar → 409 Conflict
- Invalid file format → 400 Bad Request
- File too large → 413 Payload Too Large

---

### **6.2 Get Hostel Tenants**

**Endpoint:** `GET /hostels/:hostelId/tenants`

**Access:** Owner only

**Query Params:** `?status=ACTIVE&page=1&limit=20`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "uuid": "t1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "full_name": "Amit Sharma",
        "phone": "+919876543211",
        "bed_number": "101-A",
        "room_number": "101",
        "joining_date": "2026-02-10",
        "monthly_rent": 8000,
        "pending_dues": 0,
        "status": "ACTIVE"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### **6.3 Get Tenant Details**

**Endpoint:** `GET /tenants/:tenantId`

**Access:** Owner (own hostel), Tenant (self)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tenant": {
      "uuid": "t1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "full_name": "Amit Sharma",
      "email": "amit@example.com",
      "phone": "+919876543211",
      "photo_url": "https://s3.amazonaws.com/photos/tenant_123.jpg",
      "bed_assignment": {
        "bed_number": "101-A",
        "room_number": "101",
        "floor_number": 1,
        "room_type": "DOUBLE",
        "has_ac": true
      },
      "hostel": {
        "name": "Green Valley Boys Hostel",
        "address": "123 MG Road, Bangalore"
      },
      "joining_date": "2026-02-10",
      "monthly_rent": 8000,
      "security_deposit": 16000,
      "emergency_contact": {
        "name": "Ramesh Sharma",
        "phone": "+919876543200",
        "relation": "Father"
      },
      "status": "ACTIVE"
    }
  }
}
```

---

### **6.4 Initiate Tenant Vacating**

**Endpoint:** `POST /tenants/:tenantId/vacate`

**Access:** Owner only

**Request:**
```json
{
  "vacating_date": "2026-03-15",
  "reason": "Relocation to another city"
}
```

**Validation:**
- `vacating_date`: Must be >= notice_period_days from today

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tenant": {
      "uuid": "t1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "status": "NOTICE_PERIOD",
      "vacating_date": "2026-03-15"
    }
  },
  "message": "Vacating notice recorded. Tenant notified."
}
```

---

### **6.5 Complete Tenant Checkout**

**Endpoint:** `POST /tenants/:tenantId/checkout`

**Access:** Owner only

**Request:**
```json
{
  "final_settlement_amount": 15000,
  "deductions": {
    "damage_charges": 1000,
    "pending_dues": 0
  },
  "refund_amount": 15000,
  "refund_method": "BANK_TRANSFER"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tenant": {
      "uuid": "t1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "status": "VACATED",
      "vacating_date": "2026-03-15",
      "final_settlement": {
        "security_deposit": 16000,
        "deductions": 1000,
        "refund_amount": 15000
      }
    },
    "bed": {
      "bed_number": "101-A",
      "status": "AVAILABLE"
    }
  },
  "message": "Tenant checkout completed. Bed is now available."
}
```

---

## 7. Payment & Dues Endpoints

### **7.1 Get Tenant Dues**

**Endpoint:** `GET /tenants/:tenantId/dues`

**Access:** Owner (own hostel), Tenant (self)

**Query Params:** `?status=PENDING`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "dues": [
      {
        "uuid": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "due_month": 2,
        "due_year": 2026,
        "due_date": "2026-02-01",
        "rent_amount": 8000,
        "food_charges": 2000,
        "electricity_charges": 500,
        "other_charges": 0,
        "late_fee": 0,
        "total_amount": 10500,
        "paid_amount": 0,
        "pending_amount": 10500,
        "status": "PENDING",
        "days_overdue": 0
      }
    ],
    "summary": {
      "total_pending": 10500,
      "total_overdue": 0,
      "next_due_date": "2026-03-01"
    }
  }
}
```

---

### **7.2 Initiate Payment (Tenant)**

**Endpoint:** `POST /payments/initiate`

**Access:** Tenant only

**Request:**
```json
{
  "tenant_due_id": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "amount": 10500,
  "payment_method": "RAZORPAY"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "order_id": "order_razorpay_123456",
    "amount": 10500,
    "currency": "INR",
    "razorpay_key": "rzp_live_xxxxxxxx",
    "payment_uuid": "p1b2c3d4-e5f6-7890-abcd-ef1234567890"
  },
  "message": "Payment order created. Proceed to gateway."
}
```

---

### **7.3 Verify Payment**

**Endpoint:** `POST /payments/verify`

**Access:** Tenant only

**Request:**
```json
{
  "payment_uuid": "p1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "razorpay_order_id": "order_razorpay_123456",
  "razorpay_payment_id": "pay_razorpay_789012",
  "razorpay_signature": "signature_hash_string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "uuid": "p1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "amount": 10500,
      "status": "SUCCESS",
      "transaction_date": "2026-02-03T20:45:00Z",
      "receipt_number": "RCP-2026-000123",
      "receipt_url": "https://s3.amazonaws.com/receipts/RCP-2026-000123.pdf"
    },
    "updated_due": {
      "uuid": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "status": "PAID",
      "paid_amount": 10500,
      "pending_amount": 0
    }
  },
  "message": "Payment verified successfully. Receipt sent via email."
}
```

**Edge Cases:**
- Invalid signature → 400 Bad Request
- Payment already verified → 409 Conflict
- Gateway verification failed → 422 Unprocessable Entity

---

### **7.4 Record Offline Payment (Owner)**

**Endpoint:** `POST /payments/offline`

**Access:** Owner only

**Request:**
```json
{
  "tenant_due_id": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "amount": 10500,
  "payment_method": "CASH",
  "transaction_date": "2026-02-03",
  "notes": "Received cash payment"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "uuid": "p2b2c3d4-e5f6-7890-abcd-ef1234567890",
      "amount": 10500,
      "payment_method": "CASH",
      "status": "SUCCESS",
      "receipt_number": "RCP-2026-000124"
    }
  },
  "message": "Offline payment recorded successfully"
}
```

---

### **7.5 Get Payment History**

**Endpoint:** `GET /tenants/:tenantId/payments`

**Access:** Owner (own hostel), Tenant (self)

**Query Params:** `?from_date=2026-01-01&to_date=2026-02-28`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "uuid": "p1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "amount": 10500,
        "payment_type": "RENT",
        "payment_method": "RAZORPAY",
        "transaction_date": "2026-02-03T20:45:00Z",
        "status": "SUCCESS",
        "receipt_number": "RCP-2026-000123",
        "receipt_url": "https://s3.amazonaws.com/receipts/RCP-2026-000123.pdf"
      }
    ],
    "summary": {
      "total_paid": 10500,
      "transaction_count": 1
    }
  }
}
```

---

## 8. Food Menu Endpoints

### **8.1 Create/Update Food Menu**

**Endpoint:** `POST /hostels/:hostelId/food-menu`

**Access:** Owner only

**Request:**
```json
{
  "day_of_week": 1,
  "meal_type": "LUNCH",
  "menu_items": ["Roti", "Dal", "Rice", "Sabzi", "Salad"],
  "serving_time_start": "12:30",
  "serving_time_end": "14:30"
}
```

**Validation:**
- `day_of_week`: 0-6 (Sunday to Saturday)
- `meal_type`: One of ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS']
- `menu_items`: Array of strings, min 1 item

**Response (201):**
```json
{
  "success": true,
  "data": {
    "food_menu": {
      "uuid": "fm1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "day_of_week": 1,
      "day_name": "Monday",
      "meal_type": "LUNCH",
      "menu_items": ["Roti", "Dal", "Rice", "Sabzi", "Salad"],
      "serving_time": "12:30 - 14:30"
    }
  },
  "message": "Food menu updated successfully"
}
```

---

### **8.2 Get Weekly Food Menu**

**Endpoint:** `GET /hostels/:hostelId/food-menu`

**Access:** Owner (own hostel), Tenant (assigned hostel), Guest (public)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "weekly_menu": {
      "Monday": {
        "BREAKFAST": {
          "menu_items": ["Poha", "Tea", "Banana"],
          "serving_time": "08:00 - 10:00"
        },
        "LUNCH": {
          "menu_items": ["Roti", "Dal", "Rice", "Sabzi", "Salad"],
          "serving_time": "12:30 - 14:30"
        },
        "DINNER": {
          "menu_items": ["Roti", "Paneer", "Rice", "Dal"],
          "serving_time": "20:00 - 22:00"
        }
      },
      "Tuesday": { ... }
    }
  }
}
```

---

## 9. Announcements & Notifications

### **9.1 Create Announcement**

**Endpoint:** `POST /hostels/:hostelId/announcements`

**Access:** Owner only

**Request:**
```json
{
  "title": "Water Supply Maintenance",
  "message": "Water supply will be interrupted on Sunday from 10 AM to 2 PM for tank cleaning.",
  "priority": "HIGH",
  "target_audience": "ALL",
  "valid_from": "2026-02-03T20:00:00Z",
  "valid_to": "2026-02-09T23:59:59Z"
}
```

**Validation:**
- `priority`: One of ['LOW', 'NORMAL', 'HIGH', 'URGENT']
- `target_audience`: One of ['ALL', 'TENANTS', 'SPECIFIC']
- If SPECIFIC, provide `target_tenant_ids` array

**Response (201):**
```json
{
  "success": true,
  "data": {
    "announcement": {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "Water Supply Maintenance",
      "priority": "HIGH",
      "valid_from": "2026-02-03T20:00:00Z",
      "valid_to": "2026-02-09T23:59:59Z"
    }
  },
  "message": "Announcement created. Push notifications sent to 35 tenants."
}
```

---

### **9.2 Get Announcements**

**Endpoint:** `GET /hostels/:hostelId/announcements`

**Access:** Owner (own hostel), Tenant (assigned hostel)

**Query Params:** `?active_only=true`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "announcements": [
      {
        "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "title": "Water Supply Maintenance",
        "message": "Water supply will be interrupted...",
        "priority": "HIGH",
        "created_at": "2026-02-03T20:00:00Z",
        "valid_to": "2026-02-09T23:59:59Z"
      }
    ]
  }
}
```

---

### **9.3 Get User Notifications**

**Endpoint:** `GET /notifications`

**Access:** Authenticated

**Query Params:** `?unread_only=true&page=1&limit=20`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "uuid": "n1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "title": "Payment Due Reminder",
        "message": "Your rent of ₹10,500 is due on 01-Feb-2026",
        "notification_type": "PAYMENT_DUE",
        "is_read": false,
        "created_at": "2026-01-29T09:00:00Z"
      }
    ],
    "unread_count": 5,
    "pagination": { ... }
  }
}
```

---

### **9.4 Mark Notification as Read**

**Endpoint:** `PATCH /notifications/:notificationId/read`

**Access:** Authenticated (own notification)

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 10. Guest Booking Endpoints

### **10.1 Search Hostels**

**Endpoint:** `GET /hostels/search`

**Access:** Public

**Query Params:**
```
?city=Bangalore
&hostel_type=BOYS
&check_in=2026-02-10
&check_out=2026-02-11
&min_price=300
&max_price=700
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "hostels": [
      {
        "uuid": "h1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Green Valley Boys Hostel",
        "hostel_type": "BOYS",
        "city": "Bangalore",
        "address": "123 MG Road",
        "daily_rate": 500,
        "available_beds": 5,
        "amenities": ["WiFi", "Laundry", "AC"],
        "images": ["https://cdn.example.com/hostel1.jpg"],
        "rating": 4.5,
        "distance_km": 2.3
      }
    ]
  }
}
```

---

### **10.2 Create Booking**

**Endpoint:** `POST /bookings`

**Access:** Guest only

**Request:**
```json
{
  "hostel_id": "h1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "bed_id": "b1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "check_in_date": "2026-02-10",
  "check_out_date": "2026-02-11",
  "guest_name": "Priya Singh",
  "guest_phone": "+919876543212",
  "guest_email": "priya@example.com"
}
```

**Validation:**
- `check_in_date` >= today
- `check_out_date` > `check_in_date`
- Max booking days <= system config
- Bed must be available for all dates

**Response (201):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "uuid": "bk1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "hostel_name": "Green Valley Boys Hostel",
      "bed_number": "101-A",
      "check_in_date": "2026-02-10",
      "check_out_date": "2026-02-11",
      "number_of_days": 1,
      "daily_rate": 500,
      "total_amount": 500,
      "status": "PENDING",
      "payment_required": true
    },
    "payment_order": {
      "order_id": "order_razorpay_456789",
      "amount": 500,
      "currency": "INR"
    }
  },
  "message": "Booking created. Complete payment to confirm."
}
```

**Edge Cases:**
- Bed not available for dates → 409 Conflict
- Invalid date range → 400 Bad Request
- Exceeds max booking days → 400 Bad Request

---

### **10.3 Get Booking Details**

**Endpoint:** `GET /bookings/:bookingId`

**Access:** Guest (own booking), Owner (own hostel)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "uuid": "bk1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "hostel": {
        "name": "Green Valley Boys Hostel",
        "address": "123 MG Road, Bangalore",
        "contact_phone": "+919876543210"
      },
      "bed_number": "101-A",
      "room_number": "101",
      "check_in_date": "2026-02-10",
      "check_out_date": "2026-02-11",
      "total_amount": 500,
      "payment_status": "PAID",
      "status": "CONFIRMED",
      "guest_name": "Priya Singh",
      "guest_phone": "+919876543212"
    }
  }
}
```

---

### **10.4 Cancel Booking**

**Endpoint:** `POST /bookings/:bookingId/cancel`

**Access:** Guest (own booking)

**Request:**
```json
{
  "cancellation_reason": "Change of plans"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "uuid": "bk1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "status": "CANCELLED",
      "refund_amount": 500,
      "refund_status": "PENDING"
    }
  },
  "message": "Booking cancelled. Refund will be processed in 5-7 business days."
}
```

---

## 11. Dashboard & Analytics Endpoints

### **11.1 Owner Dashboard**

**Endpoint:** `GET /dashboard/owner`

**Access:** Owner only

**Response (200):**
```json
{
  "success": true,
  "data": {
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
    "recent_payments": [ ... ],
    "upcoming_dues": [ ... ],
    "recent_bookings": [ ... ]
  }
}
```

---

### **11.2 Hostel Analytics**

**Endpoint:** `GET /hostels/:hostelId/analytics`

**Access:** Owner only

**Query Params:** `?period=6months`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "revenue_trend": [
      { "month": "Jan 2026", "revenue": 280000 },
      { "month": "Feb 2026", "revenue": 290000 }
    ],
    "occupancy_trend": [
      { "month": "Jan 2026", "occupancy_rate": 75 },
      { "month": "Feb 2026", "occupancy_rate": 80 }
    ],
    "payment_collection_rate": 95,
    "average_stay_duration": 8.5,
    "top_revenue_rooms": [ ... ]
  }
}
```

---

## 12. Admin Configuration Endpoints

### **12.1 Get System Config**

**Endpoint:** `GET /admin/config`

**Access:** Admin only

**Response (200):**
```json
{
  "success": true,
  "data": {
    "config": {
      "PAYMENT_GATEWAY": "RAZORPAY",
      "LATE_FEE_PERCENTAGE": 5,
      "PAYMENT_REMINDER_DAYS": 3,
      "MAX_BOOKING_DAYS": 7
    }
  }
}
```

---

### **12.2 Update System Config**

**Endpoint:** `PATCH /admin/config`

**Access:** Admin only

**Request:**
```json
{
  "LATE_FEE_PERCENTAGE": 10,
  "MAX_BOOKING_DAYS": 5
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "System configuration updated successfully"
}
```

---

## 13. Error Codes Reference

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Missing or invalid token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_RESOURCE` | Resource already exists |
| `BED_NOT_AVAILABLE` | Bed is occupied/reserved |
| `PAYMENT_FAILED` | Payment gateway error |
| `INVALID_SIGNATURE` | Payment verification failed |
| `BOOKING_CONFLICT` | Booking dates conflict |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

---

This completes the comprehensive API specification. Next, I'll create the module-wise feature breakdown with screen flows.
