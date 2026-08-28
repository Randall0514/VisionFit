# VisionFit Backend

## Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** installed at `C:\mongodb`

## Quick Start (After VSCode Reset)

### Option 1: Use the start script
```powershell
.\start-backend.ps1
```

### Option 2: Manual steps
```powershell
# Step 1: Start MongoDB
Start-Process -FilePath "C:\mongodb\bin\mongod.exe" -ArgumentList "--dbpath C:\mongodb\data --logpath C:\mongodb\logs\mongod.log --port 27017" -WindowStyle Hidden

# Step 2: Start the backend
cd backend
npm start
```

### Option 3: Two terminals
**Terminal 1 - MongoDB:**
```powershell
C:\mongodb\bin\mongod.exe --dbpath C:\mongodb\data --logpath C:\mongodb\logs\mongod.log --port 27017
```

**Terminal 2 - Backend:**
```powershell
cd backend
npm start
```

## Verify Everything is Running

```powershell
# Check MongoDB
netstat -an | Select-String "27017"

# Check backend
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user (auth required) |
| PUT | `/api/auth/me` | Update profile (auth required) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (auth required) |
| PUT | `/api/products/:id` | Update product (auth required) |
| DELETE | `/api/products/:id` | Delete product (auth required) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List user's orders (auth required) |
| POST | `/api/orders` | Create order (auth required) |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | List user's favorites (auth required) |
| POST | `/api/favorites/:productId` | Add to favorites (auth required) |
| DELETE | `/api/favorites/:productId` | Remove from favorites (auth required) |

## Project Structure

```
backend/
├── config/db.js          # MongoDB connection
├── models/               # Mongoose schemas
├── routes/               # API routes
├── middleware/auth.js     # JWT auth
├── .env                  # Config
├── server.js             # Entry point
└── package.json
```

## Troubleshooting

**MongoDB won't connect:**
```powershell
# Check if MongoDB is running
netstat -an | Select-String "27017"

# If not running, start it
Start-Process -FilePath "C:\mongodb\bin\mongod.exe" -ArgumentList "--dbpath C:\mongodb\data --port 27017" -WindowStyle Hidden
```

**Port 5000 already in use:**
```powershell
# Find and kill the process
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess | ForEach-Object { Stop-Process -Id $_.OwningProcess }
```