# VisionFit - Setup & Run Guide

## Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** installed at `C:\mongodb`
3. **Gmail account** with App Password for email verification

---

## First Time Setup

### 1. Install Backend Dependencies

```powershell
cd backend
npm install
```

### 2. Install Frontend Dependencies

```powershell
cd visionfit-app
npm install
```

### 3. Configure Gmail SMTP

You need a **Gmail App Password** (not your regular password):

1. Go to [myaccount.google.com](https://myaccount.google.com) → **Security**
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App Passwords** → Generate one for "Mail"
4. Edit `backend/.env` and update these values:

```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
```

---

## Running the System

### Option 1: Use the Startup Script (Easiest)

```powershell
.\start-backend.ps1
```

This starts both MongoDB and the backend server automatically.

### Option 2: Manual Startup

**Step 1 - Start MongoDB:**

```powershell
Start-Process -FilePath "C:\mongodb\bin\mongod.exe" -ArgumentList "--dbpath C:\mongodb\data --logpath C:\mongodb\logs\mongod.log --port 27017" -WindowStyle Hidden
```

**Step 2 - Start Backend:**

```powershell
cd backend
npm start
```

**Step 3 - Start Frontend:**

```powershell
cd visionfit-app
npm start
```

### Option 3: Two Terminals

**Terminal 1 - Backend:**
```powershell
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
cd visionfit-app
npm start
```

---

## Verify Everything is Running

### Check MongoDB
```powershell
netstat -an | Select-String "27017"
```
Should show: `TCP 127.0.0.1:27017 LISTENING`

### Check Backend
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```
Should return: `{ status: 'ok' }`

### Check Email SMTP
```powershell
$body = @{firstName="Test"; lastName="User"; email="your-email@gmail.com"; password="test123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/send-code" -Method POST -ContentType "application/json" -Body $body
```
Should return: `{ message: 'Verification code sent to your email' }`

---

## System Architecture

```
VisionFit/
├── backend/                    # Node.js/Express API server
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # Mongoose schemas
│   │   ├── User.js           # User accounts
│   │   ├── Product.js        # Eyewear products
│   │   ├── Order.js          # Purchase orders
│   │   ├── Favorite.js       # Saved items
│   │   └── VerificationCode.js # Email verification codes
│   ├── routes/                # API endpoints
│   │   ├── auth.js           # Auth (register, login, verify)
│   │   ├── products.js       # Product CRUD
│   │   ├── orders.js         # Order management
│   │   └── favorites.js      # Favorites management
│   ├── middleware/auth.js     # JWT authentication
│   ├── utils/email.js        # Gmail SMTP email sender
│   ├── server.js             # Express entry point
│   ├── .env                  # Environment config (secrets)
│   └── package.json
│
├── visionfit-app/             # React Native/Expo mobile app
│   ├── src/
│   │   ├── screens/          # App screens
│   │   │   ├── AuthScreen.js        # Sign in / Sign up
│   │   │   ├── VerificationScreen.js # Email verification
│   │   │   ├── DashboardScreen.js   # Home page
│   │   │   ├── CatalogScreen.js     # Product catalog
│   │   │   ├── ProductScreen.js     # Product details
│   │   │   ├── CartScreen.js        # Shopping cart
│   │   │   ├── CheckoutScreen.js    # Checkout
│   │   │   ├── FavoritesScreen.js   # Saved items
│   │   │   ├── ProfileScreen.js     # User profile
│   │   │   └── ...
│   │   ├── services/api.js   # API connection to backend
│   │   └── components/       # Reusable components
│   ├── App.js                # Navigation setup
│   └── package.json
│
├── BACKEND.md                 # Backend documentation
├── RUN_GUIDE.md              # This file
└── start-backend.ps1         # Startup script
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-code` | Send verification email |
| POST | `/api/auth/verify-code` | Verify code & create account |
| POST | `/api/auth/resend-code` | Resend verification code |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user (auth) |
| PUT | `/api/auth/me` | Update profile (auth) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (auth) |
| PUT | `/api/products/:id` | Update product (auth) |
| DELETE | `/api/products/:id` | Delete product (auth) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List user's orders (auth) |
| POST | `/api/orders` | Create order (auth) |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | List user's favorites (auth) |
| POST | `/api/favorites/:productId` | Add to favorites (auth) |
| DELETE | `/api/favorites/:productId` | Remove from favorites (auth) |

---

## Testing the Sign Up Flow

1. Open the app → Tap "Create account"
2. Fill in: First name, Last name, Email, Password, Confirm password
3. Tap "Create account"
4. Check your email for the 6-digit code
5. Enter the code on the verification screen
6. Account created → Redirected to sign in
7. Sign in with your email and password

---

## Troubleshooting

### MongoDB won't connect
```powershell
# Check if MongoDB is running
netstat -an | Select-String "27017"

# If not running, start it
Start-Process -FilePath "C:\mongodb\bin\mongod.exe" -ArgumentList "--dbpath C:\mongodb\data --port 27017" -WindowStyle Hidden
```

### Backend won't start
```powershell
# Check if port 5000 is in use
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

# Kill the process using port 5000
Get-NetTCPConnection -LocalPort 5000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### App can't connect to backend (Android)
- Ensure your computer and phone are on the same WiFi network
- Check your computer's IP: `Get-NetIPAddress -AddressFamily IPv4`
- Update `LOCAL_IP` in `visionfit-app/src/services/api.js` if needed

### Email not sending
- Verify Gmail App Password is correct in `backend/.env`
- Ensure 2-Step Verification is enabled on your Google account
- Check backend console for error messages

### Code expired
- Codes expire after 5 minutes
- Tap "Resend code" to get a new one (60-second cooldown between resends)

---

## Environment Variables (backend/.env)

```
MONGODB_URI=mongodb://localhost:27017/visionfit
PORT=5000
JWT_SECRET=visionfit_jwt_secret_key_2026
SMTP_USER=visionfit2006@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=visionfit2006@gmail.com
```

**Never commit this file to git!** It's protected by `.gitignore`.
