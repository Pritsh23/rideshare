# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js v16+ installed
- Backend running on `http://localhost:8080`

### Steps

1. **Navigate to frontend directory**
   ```bash
   cd rideshare-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

5. **Create an account and start using!**

## 📋 User Roles

### Passenger
- 🔍 Search for available rides
- 📅 Book seats in rides
- 📱 View booking history
- ⭐ Rate drivers

### Driver
- 🚗 Create new rides
- 📊 Manage ride details
- ✅ Accept/Reject bookings
- 📈 Track earnings

## 🔐 Authentication

**Register**: Create new account with email, phone, and password
**Login**: Access your account with email and password
**Logout**: Securely exit the application

## 🛠️ Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

## 💡 Tips

- Use your browser's DevTools (F12) to debug
- Check Network tab to see API calls
- Use React DevTools extension for component inspection
- All rides are saved with JWT authentication

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Backend not connecting | Ensure backend runs on port 8080 |
| Port 3000 in use | Change port in vite.config.js |
| Token not saving | Clear localStorage and login again |
| 404 errors | Verify API endpoint paths |

## 📚 Learn More

- See [README.md](./README.md) for full documentation
- See [SETUP.md](./SETUP.md) for detailed setup guide
- Check backend documentation for API details

---

**Ready to ride? Start the app and create your first account! 🚗✨**
