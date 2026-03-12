# Setup Guide - Rideshare Frontend

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Backend running on http://localhost:8080

## Step 1: Installation

Navigate to the frontend directory and install dependencies:

```bash
cd rideshare-frontend
npm install
```

## Step 2: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Verify the backend URL is correct:
```
VITE_API_URL=http://localhost:8080
```

## Step 3: Start Development Server

```bash
npm run dev
```

The frontend will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080

## Step 4: Start Using the App

### First Time Setup
1. Go to http://localhost:3000
2. Click "Sign Up" to create an account
3. Choose your role: Passenger or Driver
4. Fill in your details and register

### As a Passenger
1. Login with your credentials
2. Go to Dashboard
3. Search for rides by entering:
   - Source location
   - Destination
   - Preferred date
4. Click "Book Now" on any ride
5. View your bookings in "My Bookings"

### As a Driver
1. Login with your credentials
2. Click "Create Ride"
3. Enter ride details:
   - Start location
   - End location
   - Departure date/time
   - Price per seat
   - Number of seats
4. Submit to list your ride

## Project Structure

```
rideshare-frontend/
├── public/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Navigation.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── SuccessMessage.jsx
│   ├── context/              # State management
│   │   └── AuthContext.jsx
│   ├── pages/                # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreateRide.jsx
│   │   └── MyBookings.jsx
│   ├── services/             # API services
│   │   └── api.js
│   ├── utils/                # Utilities
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── .env.example
├── .gitignore
├── .eslintrc.json
├── package.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT token)

### Rides
- `POST /rides/create` - Create new ride (Driver)
- `GET /rides/search` - Search available rides
- `GET /rides/{id}` - Get ride details

### Bookings
- `POST /passenger/bookings/book/{rideId}` - Book a ride
- `GET /passenger/bookings/my-bookings` - Get user's bookings
- `PUT /passenger/bookings/update/{bookingId}` - Update booking status

## Troubleshooting

### Issue: CORS Error
**Solution**: Verify backend has CORS enabled for `http://localhost:3000`

### Issue: 404 on API endpoints
**Solution**: 
- Check backend is running on port 8080
- Verify `vite.config.js` proxy settings
- Check API endpoint paths match backend routes

### Issue: Token not persisting
**Solution**: 
- Check localStorage is enabled in browser
- Verify token is being saved to localStorage after login
- Check browser DevTools → Application → Local Storage

### Issue: Cannot find module
**Solution**:
```bash
rm -rf node_modules
npm install
```

### Issue: Port 3000 already in use
**Solution**: Either kill the process using port 3000 or change port in `vite.config.js`

## Development Tips

1. **Hot Module Replacement**: Changes auto-reload in browser
2. **React DevTools**: Install React DevTools browser extension
3. **Redux DevTools**: Useful for debugging state management
4. **Network Inspector**: Check API requests in DevTools → Network tab

## Building for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

Deploy using:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront
- Any static hosting service

## Features Implementation Status

### ✅ Completed
- Authentication (Login/Register)
- Route protection
- Passenger ride search
- Driver ride creation
- Booking management
- Responsive UI

### 🔄 In Progress
- Real-time chat
- Payment integration
- Rating system

### 📋 TODO
- WebSocket integration for live updates
- Map integration
- Advanced filters
- Ride history analytics
- Document upload for drivers
- Admin dashboard

## Contributing

1. Create a new branch for features
2. Follow existing code style
3. Test thoroughly before committing
4. Write meaningful commit messages

## Need Help?

- Check README.md for general info
- Review API documentation in backend
- Check browser console for errors
- Use React DevTools for debugging

---

**Happy coding! 🚀**
