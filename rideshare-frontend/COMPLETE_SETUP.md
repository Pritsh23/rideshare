# Complete Setup Guide - Rideshare Application

## 📋 Table of Contents
1. [Backend Setup](#backend-setup)
2. [Frontend Setup](#frontend-setup)
3. [Running the Application](#running-the-application)
4. [Testing the Features](#testing-the-features)
5. [Creating Test Data](#creating-test-data)
6. [Troubleshooting](#troubleshooting)

---

## Backend Setup

### Prerequisites
- Java 21+
- Maven 3.8+
- PostgreSQL 12+

### Step 1: Database Setup

1. **Install PostgreSQL** (if not already installed)
   - macOS: `brew install postgresql@15`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Linux: `sudo apt-get install postgresql`

2. **Start PostgreSQL Service**
   ```bash
   # macOS
   brew services start postgresql@15
   
   # Linux
   sudo systemctl start postgresql
   ```

3. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE rideshare_db;
   \q
   ```

### Step 2: Backend Configuration

1. **Navigate to Backend Directory**
   ```bash
   cd rideshare
   ```

2. **Check Configuration** (src/main/resources/application.yml)
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/rideshare_db
       username: postgres
       password: admin@123
   ```
   Update username/password if needed.

3. **Build Backend**
   ```bash
   ./mvnw clean build
   ```

4. **Run Backend**
   ```bash
   ./mvnw spring-boot:run
   ```
   You should see: "Tomcat started on port(s): 8080"

### Verify Backend
- Open: http://localhost:8080/actuator/health
- You should see: `{"status":"UP"}`

---

## Frontend Setup

### Prerequisites
- Node.js 16+ 
- npm 8+

### Step 1: Navigate to Frontend

```bash
cd rideshare-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- React 18
- React Router v6
- Axios
- Tailwind CSS
- Vite

### Step 3: Verify Environment

Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Verify contents:
```
VITE_API_URL=http://localhost:8080
```

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

---

## Running the Application

### Start All Services

#### Terminal 1 - PostgreSQL
```bash
# If using homebrew (macOS)
brew services start postgresql@15
# Or verify it's running
psql -U postgres -c "SELECT version();"
```

#### Terminal 2 - Backend
```bash
cd rideshare
./mvnw spring-boot:run
```
Wait for: "Started RideshareApplication in X seconds"

#### Terminal 3 - Frontend
```bash
cd rideshare-frontend
npm run dev
```
Wait for: "Local: http://localhost:3000/"

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## Testing the Features

### 1. Register a New Account

#### As Passenger
1. Click "Sign Up"
2. Fill in details:
   - Name: John Doe
   - Email: passenger@example.com
   - Phone: 555-0001
   - Role: Passenger
   - Password: TestPass123
3. Click "Create Account"
4. You'll be redirected to login

#### As Driver
1. Click "Sign Up"
2. Fill in details:
   - Name: Jane Smith
   - Email: driver@example.com
   - Phone: 555-0002
   - Role: Driver
   - Password: TestPass123
3. Click "Create Account"
4. You'll be redirected to login

### 2. Login

1. Click "Login"
2. Enter email and password
3. Click "Login"
4. You should see the Dashboard

### 3. Driver - Create a Ride

1. Login as driver (driver@example.com)
2. Click "Create Ride" or "Create a New Ride" button
3. Fill in ride details:
   - From: New York
   - To: Boston
   - Departure Date & Time: Select a future date/time
   - Price per Seat: 45.00
   - Total Seats: 4
4. Click "Create Ride"
5. You'll be redirected to dashboard

### 4. Passenger - Search Rides

1. Login as passenger (passenger@example.com)
2. You'll see the search form
3. Enter search criteria:
   - From: New York
   - To: Boston
   - Date: Select the same date you created the ride
4. Click "Search"
5. You should see the ride you created

### 5. Passenger - Book a Ride

1. Find a ride in the search results
2. Click "Book Now"
3. Enter number of seats
4. Confirm booking
5. View in "My Bookings" page

### 6. View Profile

1. Click on email in top-right corner
2. Click "Profile" (when added to navigation)
3. View or edit your information

---

## Creating Test Data

### Quick Test Setup

#### Test User 1 (Passenger)
```
Email: alice@rideshare.com
Password: password123
Role: Passenger
```

#### Test User 2 (Driver)
```
Email: bob@rideshare.com
Password: password123
Role: Driver
```

#### Test User 3 (Passenger)
```
Email: charlie@rideshare.com
Password: password123
Role: Passenger
```

### Create Test Rides

1. Login as Bob (driver@rideshare.com)
2. Create 3 different rides:
   ```
   Route 1: San Francisco → Los Angeles
   Date: Tomorrow 9:00 AM
   Price: $50/seat
   Seats: 4
   
   Route 2: San Francisco → San Jose
   Date: Tomorrow 2:00 PM
   Price: $20/seat
   Seats: 3
   
   Route 3: San Francisco → Oakland
   Date: Day after tomorrow 6:00 PM
   Price: $15/seat
   Seats: 5
   ```

3. Create bookings as Alice (alice@rideshare.com) and Charlie (charlie@rideshare.com)

---

## Troubleshooting

### 🔴 Backend Issues

#### Issue: "Cannot connect to database"
```
com.mysql.jdbc.exceptions.jdbc4.MySQLNonTransientConnectionException
```
**Solution:**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1;"

# Restart PostgreSQL
brew services restart postgresql@15

# Verify database exists
psql -U postgres -l | grep rideshare_db
```

#### Issue: "Port 8080 already in use"
**Solution:**
```bash
# Kill process using port 8080
lsof -ti:8080 | xargs kill -9

# Or change port in application.yml
server:
  port: 8081
```

#### Issue: "Invalid jwt token"
**Solution:**
- Logout and login again
- Clear localStorage in DevTools
- Verify token is being generated correctly

### 🟡 Frontend Issues

#### Issue: "Cannot connect to backend"
```
Error: Network Error
```
**Solution:**
1. Verify backend is running on port 8080
2. Check vite.config.js proxy settings
3. Open DevTools → Network tab to see requests
4. Verify CORS is enabled in backend

#### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in vite.config.js
server: {
  port: 3001,
}
```

#### Issue: "Module not found"
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache if issues persist
npm cache clean --force
npm install
```

#### Issue: "Token not persisting"
**Solution:**
1. Open DevTools → Application
2. Check Local Storage for 'token' and 'user'
3. If empty, login was not successful
4. Check Network tab for login request response

### 🟢 Database Issues

#### Issue: "FATAL: role 'postgres' does not exist"
**Solution:**
```bash
# Initialize PostgreSQL (first time only)
initdb /usr/local/var/postgres

# Or create the role
createuser postgres
```

#### Issue: "database 'rideshare_db' does not exist"
**Solution:**
```bash
psql -U postgres -c "CREATE DATABASE rideshare_db;"
```

---

## Environment Details

### Default Configuration

**Frontend**
```
URL: http://localhost:3000
Port: 3000
```

**Backend**
```
URL: http://localhost:8080/api
Port: 8080
```

**Database**
```
Type: PostgreSQL
Host: localhost
Port: 5432
Database: rideshare_db
Username: postgres
Password: admin@123
```

### Commands Reference

```bash
# Backend
cd rideshare
./mvnw spring-boot:run          # Run backend
./mvnw clean build              # Build backend
./mvnw test                     # Run tests

# Frontend
cd rideshare-frontend
npm run dev                     # Start dev server
npm run build                   # Build for production
npm run preview                 # Preview build
npm run lint                    # Lint code

# PostgreSQL
psql -U postgres                # Connect to PostgreSQL
psql -U postgres -l             # List all databases
psql -U postgres -d rideshare_db  # Connect to rideshare_db
```

---

## Next Steps

1. ✅ Setup complete - both backend and frontend running
2. 🧪 Create test accounts (see above)
3. ✅ Test features (passenger/driver flows)
4. 📚 Read ARCHITECTURE.md for design details
5. 💻 Start customizing for your needs

---

## Support Resources

- Frontend README: [README.md](./README.md)
- Quick Start: [QUICKSTART.md](./QUICKSTART.md)
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Backend Setup: See backend README

---

**Congratulations! Your Rideshare application is ready! 🎉🚗**
