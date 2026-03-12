# Rideshare Frontend

A modern React application for a rideshare platform. This frontend connects to the Rideshare Spring Boot backend.

## Features

- **User Authentication**: Register and login as passenger or driver
- **Ride Search**: Passengers can search for available rides
- **Ride Creation**: Drivers can create new rides
- **Booking Management**: Passengers can view and manage their bookings
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Real-time Updates**: Integration with backend API

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navigation.jsx   # Navigation bar
│   └── ProtectedRoute.jsx # Route protection
├── context/            # React context for state management
│   └── AuthContext.jsx  # Authentication context
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── CreateRide.jsx  # Ride creation
│   └── MyBookings.jsx  # User bookings
├── services/           # API services
│   └── api.js          # Axios API client
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create .env file** (copy from .env.example):
   ```bash
   cp .env.example .env
   ```

3. **Ensure backend is running** on http://localhost:8080

## Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## API Integration

The frontend connects to the following backend endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Rides
- `POST /rides/create` - Create a new ride
- `GET /rides/search` - Search available rides
- `GET /rides/{id}` - Get ride details

### Bookings
- `POST /passenger/bookings/book/{rideId}` - Book a ride
- `GET /passenger/bookings/my-bookings` - Get user's bookings
- `PUT /passenger/bookings/update/{bookingId}` - Update booking status

## Technologies Used

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server
- **JavaScript ES6+** - Language

## Environment Variables

```
VITE_API_URL=http://localhost:8080
```

## Features Implemented

### ✅ Authentication
- User registration with role selection (Passenger/Driver)
- User login with JWT token management
- Logout functionality

### ✅ Passenger Features
- Search rides by source, destination, and date
- Browse available rides with details
- Book rides (integration ready)
- View booking history
- Cancel bookings (integration ready)

### ✅ Driver Features
- Create new rides with route and price details
- View created rides
- Manage ride details
- Accept/reject bookings

### ✅ UI/UX
- Responsive design
- Clean navigation
- Form validation
- Error handling
- Loading states
- Protected routes

## Future Enhancements

- Real-time chat between passengers and drivers
- Payment integration
- Rating and review system
- Map integration for route visualization
- Notification system
- Driver documents verification
- Admin dashboard for platform management
- Vehicle details management
- Ride history and analytics

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify API endpoints match backend routes

### Module Not Found
- Run `npm install` again
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Port Already in Use
- Change the port in vite.config.js
- Or kill the process using port 3000

## License

MIT
