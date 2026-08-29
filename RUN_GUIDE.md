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

### 2. Install Mobile App Dependencies

```powershell
cd visionfit-app
npm install
```

### 3. Install Admin Web Dependencies

```powershell
cd visionfit-web
npm install
```

### 4. Configure Gmail SMTP

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

### 5. Seed Admin User & Sample Data

```powershell
cd backend
node seed-admin.js
node seed-products.js
```

This creates:
- Admin account: `admin@visionfit.com` / `admin123`
- 8 sample eyewear products

---

## Running the System

You need **3 terminals** running at the same time.

### Terminal 1 — MongoDB

```powershell
Start-Process -FilePath "C:\mongodb\bin\mongod.exe" -ArgumentList "--dbpath C:\mongodb\data --logpath C:\mongodb\logs\mongod.log --port 27017" -WindowStyle Hidden
```

Or use the startup script:

```powershell
.\start-backend.ps1
```

### Terminal 2 — Backend API

```powershell
cd backend
npm start
```

Runs on `http://localhost:5000`

### Terminal 3 — Admin Web Dashboard

```powershell
cd visionfit-web
npm run dev
```

Opens on `http://localhost:5173`

### Terminal 4 — Mobile App (Expo Go)

```powershell
cd visionfit-app
npm start
```

Scan the QR code with Expo Go on your phone.

---

## Quick Start (All at Once)

```powershell
# Start MongoDB
Start-Process -FilePath "C:\mongodb\bin\mongod.exe" -ArgumentList "--dbpath C:\mongodb\data --logpath C:\mongodb\logs\mongod.log --port 27017" -WindowStyle Hidden

# Start Backend
Start-Process -FilePath "cmd" -ArgumentList "/c cd /d $PWD\backend && npm start"

# Start Admin Web
Start-Process -FilePath "cmd" -ArgumentList "/c cd /d $PWD\visionfit-web && npm run dev"

# Start Mobile App
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

### Check Admin Web
Open `http://localhost:5173` in your browser. You should see the login page.

---

## Admin Dashboard Login

1. Open `http://localhost:5173`
2. Enter: `admin@visionfit.com` / `admin123`
3. You'll see the dashboard with stats, products, and orders

### Admin Features
- **Dashboard** — View total orders, revenue, users, and recent orders
- **Products** — Add, edit, delete products. Upload images. Search and filter.
- **Orders** — View all customer orders. Filter by status. Update order status.

---

## Mobile App Sign Up Flow

1. Open the app → Tap "Create account"
2. Fill in: First name, Last name, Email, Password, Confirm password
3. Tap "Create account"
4. Check your email for the 6-digit code
5. Enter the code on the verification screen
6. Account created → Redirected to sign in
7. Sign in with your email and password

---

## System Architecture

```
VisionFit/
├── backend/                        # Node.js/Express API server
│   ├── config/db.js               # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication
│   │   └── admin.js               # Admin-only middleware
│   ├── models/
│   │   ├── User.js                # User accounts (with role)
│   │   ├── Product.js             # Eyewear products
│   │   ├── Order.js               # Purchase orders
│   │   ├── Favorite.js            # Saved items
│   │   └── VerificationCode.js    # Email verification codes
│   ├── routes/
│   │   ├── auth.js                # Auth + admin creation
│   │   ├── products.js            # Product CRUD (admin-protected)
│   │   ├── orders.js              # Order management + admin endpoints
│   │   ├── favorites.js           # Favorites management
│   │   └── upload.js              # Image upload (multer)
│   ├── uploads/                   # Uploaded product images
│   ├── utils/email.js             # Gmail SMTP email sender
│   ├── server.js                  # Express entry point
│   ├── seed-admin.js              # Seeds admin user
│   ├── seed-products.js           # Seeds sample products
│   ├── .env                       # Environment config (secrets)
│   └── package.json
│
├── visionfit-app/                 # React Native/Expo mobile app
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoadingScreen.js   # Auto-login check
│   │   │   ├── AuthScreen.js      # Sign in / Sign up
│   │   │   ├── VerificationScreen.js # Email verification
│   │   │   ├── DashboardScreen.js # Home page
│   │   │   ├── CatalogScreen.js   # Product catalog
│   │   │   ├── ProductScreen.js   # Product details
│   │   │   ├── CartScreen.js      # Shopping cart
│   │   │   ├── CheckoutScreen.js  # Checkout
│   │   │   ├── FavoritesScreen.js # Saved items
│   │   │   ├── ProfileScreen.js   # User profile (with initials avatar)
│   │   │   └── ...
│   │   ├── services/api.js        # API connection to backend
│   │   └── components/            # Reusable components
│   ├── App.js                     # Navigation setup
│   └── package.json
│
├── visionfit-web/                 # React + TypeScript admin dashboard
│   ├── src/
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── api.ts                 # Typed API service
│   │   ├── context/AuthContext.tsx # JWT auth state
│   │   ├── components/
│   │   │   ├── Layout.tsx         # Sidebar + header
│   │   │   ├── ProtectedRoute.tsx # Auth guard
│   │   │   └── StatsCard.tsx      # Stats card
│   │   ├── pages/
│   │   │   ├── Login.tsx          # Admin login
│   │   │   ├── Dashboard.tsx      # Stats + recent orders
│   │   │   ├── Products.tsx       # Product list
│   │   │   ├── ProductForm.tsx    # Add/edit product
│   │   │   ├── Orders.tsx         # Order list
│   │   │   └── OrderDetail.tsx    # Order detail + status update
│   │   ├── App.tsx                # Route configuration
│   │   └── main.tsx               # Entry point
│   ├── vite.config.ts             # Vite config with API proxy
│   └── package.json
│
├── BACKEND.md                     # Backend documentation
├── RUN_GUIDE.md                   # This file
└── start-backend.ps1              # Startup script
```

---

## API Endpoints

### Authentication
- `POST /api/auth/send-code` — Send verification email
- `POST /api/auth/verify-code` — Verify code & create account
- `POST /api/auth/resend-code` — Resend verification code
- `POST /api/auth/register` — Direct registration
- `POST /api/auth/login` — Sign in (returns role)
- `GET /api/auth/me` — Get current user (auth)
- `PUT /api/auth/me` — Update profile (auth)
- `POST /api/auth/create-admin` — Create admin account (admin only)

### Products
- `GET /api/products` — List all products (supports search, category, frameShape filters)
- `GET /api/products/:id` — Get single product
- `POST /api/products` — Create product (admin only)
- `PUT /api/products/:id` — Update product (admin only)
- `DELETE /api/products/:id` — Delete product (admin only)

### Orders
- `GET /api/orders` — List user's orders (auth)
- `GET /api/orders/admin/all` — List all orders (admin only, paginated)
- `GET /api/orders/admin/stats` — Dashboard stats (admin only)
- `GET /api/orders/admin/:id` — Get any order (admin only)
- `POST /api/orders` — Create order (auth)
- `PUT /api/orders/admin/:id/status` — Update any order status (admin only)
- `PUT /api/orders/:id/status` — Update own order status (auth)

### Favorites
- `GET /api/favorites` — List user's favorites (auth)
- `POST /api/favorites/:productId` — Add to favorites (auth)
- `DELETE /api/favorites/:productId` — Remove from favorites (auth)

### Upload
- `POST /api/upload` — Upload image (admin only)

---

## Troubleshooting

### MongoDB won't connect
```powershell
netstat -an | Select-String "27017"
Start-Process -FilePath "C:\mongodb\bin\mongod.exe" -ArgumentList "--dbpath C:\mongodb\data --port 27017" -WindowStyle Hidden
```

### Backend won't start
```powershell
Get-NetTCPConnection -LocalPort 5000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Admin web won't connect to backend
- Make sure the backend is running on port 5000
- The Vite proxy handles CORS automatically — no manual config needed

### Mobile app can't connect to backend
- Ensure your computer and phone are on the same WiFi network
- Check your computer's IP: `Get-NetIPAddress -AddressFamily IPv4`
- Update `LOCAL_IP` in `visionfit-app/src/services/api.js` if needed

### Email not sending
- Verify Gmail App Password is correct in `backend/.env`
- Ensure 2-Step Verification is enabled on your Google account

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
