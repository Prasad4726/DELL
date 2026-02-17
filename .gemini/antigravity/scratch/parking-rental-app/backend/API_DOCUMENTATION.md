# API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "role": "USER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### Get Profile
**GET** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

## Parking Endpoints

### Search Nearby Parkings
**GET** `/parkings/nearby`

**Query Parameters:**
- `latitude` (required): User latitude
- `longitude` (required): User longitude
- `radius` (optional): Search radius in meters (default: 5000)
- `type` (optional): PUBLIC or PRIVATE

**Example:**
```
GET /parkings/nearby?latitude=28.6139&longitude=77.2090&radius=5000
```

**Response:**
```json
{
  "success": true,
  "message": "Nearby parkings retrieved successfully",
  "data": {
    "count": 5,
    "parkings": [
      {
        "id": 1,
        "name": "Central Parking",
        "address": "123 Main St",
        "latitude": 28.6140,
        "longitude": 77.2095,
        "pricePerHour": 50.00,
        "type": "PUBLIC",
        "totalSlots": 20,
        "availableSlots": 15,
        "distance": 250
      }
    ]
  }
}
```

### Get Parking Details
**GET** `/parkings/:id`

**Response:**
```json
{
  "success": true,
  "message": "Parking retrieved successfully",
  "data": {
    "id": 1,
    "name": "Central Parking",
    "address": "123 Main St",
    "pricePerHour": 50.00,
    "totalSlots": 20,
    "availableSlots": 15,
    "averageRating": 4.5,
    "totalReviews": 25,
    "owner": {
      "id": 2,
      "name": "Owner Name",
      "phone": "+1234567890"
    }
  }
}
```

### Create Parking (Owner/Admin)
**POST** `/parkings`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "My Parking",
  "address": "456 Park Ave",
  "latitude": 28.6150,
  "longitude": 77.2100,
  "pricePerHour": 60.00,
  "type": "PRIVATE",
  "totalSlots": 10,
  "description": "Covered parking with CCTV",
  "amenities": ["CCTV", "Covered", "Security"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Parking location created successfully",
  "data": { /* parking object */ }
}
```

---

## Booking Endpoints

### Create Booking
**POST** `/bookings`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "parkingId": 1,
  "slotId": 5,
  "startTime": "2024-12-17T10:00:00Z",
  "endTime": "2024-12-17T14:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "parkingId": 1,
    "slotId": 5,
    "startTime": "2024-12-17T10:00:00Z",
    "endTime": "2024-12-17T14:00:00Z",
    "totalHours": 4.00,
    "totalPrice": 200.00,
    "status": "PENDING",
    "bookingCode": "BK-20241217-A1B2C3"
  }
}
```

### Get My Bookings
**GET** `/bookings/my`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED)

**Response:**
```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": {
    "count": 3,
    "bookings": [ /* array of booking objects */ ]
  }
}
```

### Cancel Booking
**POST** `/bookings/:id/cancel`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": { /* updated booking object */ }
}
```

---

## Payment Endpoints

### Create Payment
**POST** `/payments`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bookingId": 1,
  "paymentMethod": "CARD"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "id": 1,
    "bookingId": 1,
    "amount": 200.00,
    "paymentMethod": "CARD",
    "status": "PENDING",
    "paymentGateway": "stripe"
  }
}
```

### Process Payment
**POST** `/payments/:id/process`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "success": true,
  "transactionId": "txn_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment completed successfully",
  "data": {
    "id": 1,
    "status": "SUCCESS",
    "transactionId": "txn_1234567890"
  }
}
```

---

## Review Endpoints

### Create Review
**POST** `/reviews`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "parkingId": 1,
  "bookingId": 1,
  "rating": 5,
  "comment": "Great parking facility!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": { /* review object */ }
}
```

### Get Parking Reviews
**GET** `/reviews/parking/:parkingId`

**Response:**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "averageRating": 4.5,
    "totalReviews": 25,
    "reviews": [ /* array of review objects */ ]
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* optional array of detailed errors */ ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Invalid/missing token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., booking overlap)
- `500` - Internal Server Error

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Response on limit**: 429 Too Many Requests
