# Frontend Architecture Documentation

## 📊 Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React Frontend (Vite)                 │
│                    (localhost:3000)                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │            React Components & Pages             │   │
│  │  - Navigation                                   │   │
│  │  - Login / Register                             │   │
│  │  - Dashboard (for Passenger & Driver)           │   │
│  │  - Create Ride (Driver)                         │   │
│  │  - My Bookings (Passenger)                      │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓↑                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │         State Management (React Context)        │   │
│  │  - AuthContext (user, token, auth state)        │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓↑                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │            API Integration (Axios)              │   │
│  │  - authAPI (login, register)                    │   │
│  │  - rideAPI (search, create)                     │   │
│  │  - bookingAPI (book, manage)                    │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓↑                              │
└─────────────────────────────────────────────────────────┘
         ↓↑ Axios HTTP (with JWT tokens)
┌─────────────────────────────────────────────────────────┐
│          Spring Boot Backend API                        │
│          (localhost:8080)                               │
│                                                         │
│  - Authentication (JWT)                                 │
│  - Ride Management                                      │
│  - Booking Management                                   │
│  - Payment Processing                                   │
│  - PostgreSQL Database                                  │
└─────────────────────────────────────────────────────────┘
```

## 🗂️ Directory Structure

```
src/
├── components/                    # Reusable UI components
│   ├── Navigation.jsx            # Top navigation bar
│   ├── ProtectedRoute.jsx        # Route authentication wrapper
│   ├── LoadingSpinner.jsx        # Loading state indicator
│   ├── ErrorMessage.jsx          # Error notification
│   └── SuccessMessage.jsx        # Success notification
│
├── context/                       # React Context API
│   └── AuthContext.jsx           # Authentication state
│       ├── user: stored user data
│       ├── token: JWT token
│       ├── isAuthenticated: auth state
│       └── Methods: login, register, logout
│
├── pages/                         # Page components
│   ├── Home.jsx                  # Landing page
│   ├── Login.jsx                 # User login
│   ├── Register.jsx              # User registration
│   ├── Dashboard.jsx             # Main dashboard
│   │   ├── Passenger view: search rides
│   │   └── Driver view: view rides
│   ├── CreateRide.jsx            # Driver creates ride
│   ├── MyBookings.jsx            # Passenger bookings
│   └── Profile.jsx               # User profile
│
├── services/                      # API communication
│   └── api.js                    # Axios instance & endpoints
│       ├── authAPI: login, register
│       ├── rideAPI: CRUD operations
│       └── bookingAPI: booking management
│
├── hooks/                         # Custom React hooks
│   └── useApiCall.js             # Reusable API hook
│
├── utils/                         # Utilities & helpers
│   ├── helpers.js                # Formatting, validation
│   └── constants.js              # App-wide constants
│
├── App.jsx                        # Main app + routing
├── main.jsx                       # Entry point
└── index.css                      # Global styles
```

## 🔄 Data Flow

### Authentication Flow
```
User Input (Login/Register)
    ↓
AuthContext.login() / register()
    ↓
API Call (authAPI)
    ↓
Backend Response
    ↓
Token stored in localStorage
    ↓
User state updated
    ↓
Redirect to dashboard
```

### Ride Search Flow
```
User enters search criteria
    ↓
handleSearch() triggered
    ↓
rideAPI.searchRides(filters)
    ↓
Axios adds JWT token to headers
    ↓
Backend processes request
    ↓
Returns matching rides
    ↓
Rides state updated
    ↓
UI renders ride list
```

### Booking Flow
```
User clicks "Book Now"
    ↓
Confirm seats to book
    ↓
bookingAPI.bookRide(rideId, seats)
    ↓
Backend validates booking
    ↓
Creates booking record
    ↓
Returns confirmation
    ↓
Updates user's bookings list
    ↓
Shows success message
```

## 🔐 Authentication

### JWT Token Flow
1. **Registration**: User creates account
2. **Login**: User sends email/password
3. **Backend**: Returns JWT token
4. **Storage**: Token saved to localStorage
5. **API Calls**: Token included in Authorization header
6. **Protected Routes**: Token required to access
7. **Logout**: Token removed from storage

### Protected Routes
```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## 🎨 Component Hierarchy

```
App
├── BrowserRouter
├── AuthProvider
├── Navigation
└── Routes
    ├── / → Home
    ├── /login → PublicRoute → Login
    ├── /register → PublicRoute → Register
    ├── /dashboard → ProtectedRoute → Dashboard
    ├── /create-ride → ProtectedRoute → CreateRide
    ├── /my-bookings → ProtectedRoute → MyBookings
    └── * → Navigate to /
```

## 📡 API Integration

### Request Interceptor
```javascript
// Automatically adds JWT token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Endpoints Structure

**Authentication**
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/admin/users
```

**Rides**
```
POST /rides/create
GET /rides/search
GET /rides/{id}
GET /rides/driver/my-rides
```

**Bookings**
```
POST /passenger/bookings/book/{rideId}
GET /passenger/bookings/my-bookings
PUT /passenger/bookings/update/{bookingId}
```

## 🎯 State Management

### AuthContext State
```javascript
{
  user: {
    email: string,
    role: 'PASSENGER' | 'DRIVER'
  },
  isAuthenticated: boolean,
  loading: boolean,
  token: string // stored in localStorage
}
```

### Component State Examples
```javascript
// Dashboard.jsx
const [rides, setRides] = useState([])
const [loading, setLoading] = useState(false)
const [searchFilters, setSearchFilters] = useState({
  source: '',
  destination: '',
  date: ''
})
```

## 🎨 Styling Approach

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive**: Mobile-first design
- **Colors**: 
  - Primary: Blue (#2563eb)
  - Secondary: Dark Blue (#1e40af)
  
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## ⚙️ Configuration Files

### vite.config.js
- Dev server on port 3000
- Proxy to backend on port 8080
- React plugin for HMR

### tailwind.config.js
- Custom colors
- Extended theme
- Content paths

### postcss.config.js
- Tailwind processing
- Autoprefixer support

### .eslintrc.json
- Code quality rules
- React best practices
- JSX/React hooks validation

## 🔄 Lifecycle Hooks Usage

### useEffect Examples
```javascript
// On component mount - fetch data
useEffect(() => {
  fetchData();
}, []);

// On state change
useEffect(() => {
  handleSearchChange();
}, [searchFilters]);

// Cleanup on unmount
useEffect(() => {
  return () => {
    cleanup();
  };
}, []);
```

## 📊 Performance Considerations

1. **Lazy Loading**: Route-based code splitting
2. **Memoization**: Prevent unnecessary re-renders
3. **API Caching**: Cache ride search results
4. **Image Optimization**: Use appropriate sizes
5. **Bundle**: Vite provides optimized builds

## 🚀 Deployment Considerations

### Development
- Hot module replacement
- Source maps
- Console logs

### Production
- Minified code
- Tree shaking
- Code splitting
- Sourcemaps disabled

### Environment Variables
```
VITE_API_URL=http://localhost:8080  // Development
VITE_API_URL=https://api.rideshare.com  // Production
```

## 🔍 Debugging Tips

1. **Browser DevTools**: F12
2. **React DevTools Extension**: Component inspection
3. **Network Tab**: API request monitoring
4. **Console**: Error messages
5. **Local Storage**: Check token persistence

---

This architecture provides a scalable, maintainable frontend for the Rideshare application with clear separation of concerns and reusable components.
