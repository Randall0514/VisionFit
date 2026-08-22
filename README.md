# VisionFit
> **SYSDEV-02 · GROUP 06**  
> A mobile app for personalized eyewear styling and direct shopping — powered by face scanning, prescription input, and smart frame recommendations.
### Group Members
| # | Name |
|---|------|
| 1 | Benavides, Denzel Art A. |
| 2 | Oronce, Rryor Andrew |
| 3 | Salvador, Randall Benedict |
| 4 | Bacani, Jerwin |
| 5 | Aguilon, Mark Bryan |

## 🚀 Getting Started

Follow these steps **exactly** to run the app on your phone using **Expo Go**.

### Prerequisites — install these once

| Tool | Where to get it |
|------|----------------|
| **Node.js** (v18 or later) | https://nodejs.org |
| **npm** (comes with Node) | — |
| **Expo Go** app | [Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent) · [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779) |

> ⚠️ Your **phone and computer must be on the same Wi-Fi network**.

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/<your-username>/VisionFit.git
cd VisionFit
```

### Step 2 — Go into the app folder

```bash
cd visionfit-app
```

### Step 3 — Install dependencies

```bash
npm install
```

> This will install all required packages (React Native, Expo, Navigation, etc.).  
> It may take **2–5 minutes** the first time.

### Step 4 — Start the development server

```bash
npm start
```

A **QR code** will appear in your terminal.

### Step 5 — Open on your phone

- **Android** → Open **Expo Go** → tap **"Scan QR code"** → scan the QR in your terminal.  
- **iPhone** → Open the default **Camera app** → point at the QR code → tap the Expo Go notification.

The app will bundle and launch on your phone. 🎉

---

## 📁 Project Structure

```
VisionFit/
└── visionfit-app/
    ├── App.js                   # Navigation & tab bar setup
    ├── index.js                 # Entry point
    ├── package.json
    └── src/
        ├── components/
        │   └── TabIcons.js      # Custom bottom-tab icons
        └── screens/
            ├── OnboardingScreen.js   # Welcome / Get Started page
            ├── DashboardScreen.js    # Home dashboard
            ├── HistoryScreen.js      # Test history
            ├── CatalogScreen.js      # Frame catalog
            ├── EducationScreen.js    # Educational hub
            └── ProfileScreen.js     # User profile
```
---
## 🛠 Troubleshooting
### `'expo' is not recognized`
You may be trying to run `npx expo start` before `npm install` is done.  
Always run `npm install` first inside the `visionfit-app/` folder.
### `Unable to resolve @expo/vector-icons`
Clear the Metro cache:
```bash
npx expo start --clear
```
### `Something went wrong` in Expo Go
Make sure your phone and computer are on the **same Wi-Fi network**.  
If the problem persists, stop the server (`Ctrl+C`) and run:
```bash
npm start
```
### `SafeAreaView` warning
This is a non-breaking warning. The project already uses `react-native-safe-area-context` — no action needed.
---
## 📱 App Screens (Static Prototype)
| Screen | Description |
|--------|-------------|
| Onboarding | Welcome page with Get Started button |
| Dashboard | Home with daily habit card & quick actions |
| History | Test history with wellness score |
| Catalog | Eyewear frame browser with filters |
| Education | Articles on eye health |
| Profile | User account & settings |
