# API Documentation

## Base URL
```
http://localhost:8080
```

## Authentication
All requests (except login/register) require JWT token in header:
```
Authorization: Bearer {token}
```

---

## Authentication Endpoints

### Register User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-0001",
  "password": "SecurePass123",
  "role": "PASSENGER"
}
```

**Response:**
```json
"User registered successfully"
```

**Status Code:** 200

---

### Login User
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
(JWT Token)

**Status Code:** 200

---

### Get All Users (Admin)
**Endpoint:** `GET /api/auth/admin/users`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-0001",
    "role": "PASSENGER",
    "rating": 4.5,
    "createdAt": "2024-03-12T10:30:00"
  }
]
```

**Status Code:** 200

---

## Ride Endpoints

### Create Ride
**Endpoint:** `POST /rides/create`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "source": "San Francisco",
  "destination": "Los Angeles",
  "departureTime": "2024-03-15T09:00:00",
  "pricePerSeat": 50.00,
  "totalSeats": 4
}
```

**Response:**
```json
{
  "id": 1,
  "source": "San Francisco",
  "destination": "Los Angeles",
  "departureTime": "2024-03-15T09:00:00",
  "pricePerSeat": 50.00,
  "totalSeats": 4,
  "availableSeats": 4,
  "status": "CREATED",
  "driver": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "rating": 4.8
  }
}
```

**Status Code:** 200
**Error:** 401 Unauthorized, 400 Bad Request

---

### Search Rides
**Endpoint:** `GET /rides/search`

**Query Parameters:**
```
source=San Francisco
destination=Los Angeles
departureTime=2024-03-15T09:00:00 (optional)
```

**Headers:**
```
Authorization: Bearer {token}
```

**Example URL:**
```
/rides/search?source=San Francisco&destination=Los Angeles
```

**Response:**
```json
[
  {
    "id": 1,
    "source": "San Francisco",
    "destination": "Los Angeles",
    "departureTime": "2024-03-15T09:00:00",
    "pricePerSeat": 50.00,
    "totalSeats": 4,
    "availableSeats": 2,
    "status": "CREATED",
    "driver": {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "rating": 4.8
    }
  }
]
```

**Status Code:** 200

---

### Get Ride Details
**Endpoint:** `GET /rides/{rideId}`

**Path Parameters:**
```
rideId: 1
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "source": "San Francisco",
  "destination": "Los Angeles",
  "departureTime": "2024-03-15T09:00:00",
  "pricePerSeat": 50.00,
  "totalSeats": 4,
  "availableSeats": 2,
  "status": "CREATED",
  "driver": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "555-0001",
    "rating": 4.8
  },
  "bookings": [
    {
      "id": 1,
      "passenger": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "numberOfSeats": 2,
      "status": "CONFIRMED"
    }
  ]
}
```

**Status Code:** 200
**Error:** 404 Not Found

---

### Get Driver's Rides
**Endpoint:** `GET /rides/driver/my-rides`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "source": "San Francisco",
    "destination": "Los Angeles",
    "departureTime": "2024-03-15T09:00:00",
    "pricePerSeat": 50.00,
    "totalSeats": 4,
    "availableSeats": 2,
    "status": "CREATED"
  }
]
```

**Status Code:** 200

---

## Booking Endpoints

### Book a Ride
**Endpoint:** `POST /passenger/bookings/book/{rideId}`

**Path Parameters:**
```
rideId: 1
```

**Query Parameters:**
```
seats: 2
```

**Headers:**
```
Authorization: Bearer {token}
```

**Example URL:**
```
/passenger/bookings/book/1?seats=2
```

**Response:**
```json
{
  "id": 1,
  "ride": {
    "id": 1,
    "source": "San Francisco",
    "destination": "Los Angeles"
  },
  "passenger": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "numberOfSeats": 2,
  "totalPrice": 100.00,
  "status": "PENDING",
  "bookingDateTime": "2024-03-12T10:30:00"
}
```

**Status Code:** 200
**Error:** 400 (Not enough seats), 404 (Ride not found), 401 (Unauthorized)

---

### Get Passenger's Bookings
**Endpoint:** `GET /passenger/bookings/my-bookings`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "ride": {
      "id": 1,
      "source": "San Francisco",
      "destination": "Los Angeles",
      "departureTime": "2024-03-15T09:00:00",
      "pricePerSeat": 50.00,
      "driver": {
        "name": "Jane Smith",
        "rating": 4.8
      }
    },
    "numberOfSeats": 2,
    "totalPrice": 100.00,
    "status": "CONFIRMED",
    "bookingDateTime": "2024-03-12T10:30:00"
  }
]
```

**Status Code:** 200

---

### Update Booking Status
**Endpoint:** `PUT /passenger/bookings/update/{bookingId}`

**Path Parameters:**
```
bookingId: 1
```

**Query Parameters:**
```
status: CONFIRMED | CANCELLED | COMPLETED
```

**Headers:**
```
Authorization: Bearer {token}
```

**Example URL:**
```
/passenger/bookings/update/1?status=CONFIRMED
```

**Response:**
```json
{
  "id": 1,
  "ride": {
    "id": 1,
    "source": "San Francisco",
    "destination": "Los Angeles"
  },
  "numberOfSeats": 2,
  "totalPrice": 100.00,
  "status": "CONFIRMED",
  "bookingDateTime": "2024-03-12T10:30:00"
}
```

**Status Code:** 200
**Error:** 400 (Invalid status), 404 (Booking not found), 401 (Unauthorized)

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "Source and destination are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Ride with id 999 not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Request/Response Examples

### cURL Examples

#### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-0001",
    "password": "SecurePass123",
    "role": "PASSENGER"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

#### Search Rides
```bash
curl -X GET "http://localhost:8080/rides/search?source=San Francisco&destination=Los Angeles" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Book a Ride
```bash
curl -X POST "http://localhost:8080/passenger/bookings/book/1?seats=2" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Rate Limiting
Currently no rate limiting implemented. Implement as needed for production.

---

## Pagination
Add pagination support:
```
GET /rides/search?page=0&size=10
```

---

## Sorting
Add sorting support:
```
GET /rides/search?sort=price,asc&sort=departureTime,desc
```

---

## API Testing

### Postman Collection
[Import into Postman](./postman-collection.json) (To be created)

### Thunder Client
[Thunder Client collection](./thunder-collection.json) (To be created)

---

## WebSocket Endpoints (Future)

### Location Updates
```
/ws/locations/{rideId}
```

### Chat Messages
```
/ws/chat/{rideId}
```

---

**Last Updated:** March 12, 2024
**Version:** 1.0
