# Branded Short-Link & Bio-Link Hub (MERN Stack)

A high-performance full-stack web application built using the **MERN Stack** (MongoDB, Express.js, React 18, Node.js) featuring two core modules:
1. **URL Shortener & Telemetry Analytics**: Secure JWT-authenticated URL shortener supporting random 6-character slugs or custom branded aliases, rate limiting, vector QR Code generation, and real-time click analytics (clicks over time, top referrers, device distribution).
2. **Link-in-Bio Profile Hub**: Customizable public bio profiles hosted at `/bio/:username` with dynamic avatar uploads, bio descriptions, social links, and 3 selectable visual themes (*Dark Slate*, *Minimal Light*, *Gradient*).

Adheres strictly to the **Linear / Modern Design System** with near-black aesthetics (`#050506`), layered ambient lighting, mouse-tracking spotlight cards, crisp typography, micro-interactions, and responsive bento grid layouts.

---

## Key Features

- **Authentication & Security**:
  - Email & password signup/login.
  - Simulated email verification workflow with verification tokens.
  - Password reset workflow: Forgot password request -> Reset password submission.
  - Dual JWT token mechanism (`accessToken` valid for 15m, `refreshToken` valid for 7d) delivered securely via `httpOnly` cookies.
  - Automatic silent JWT token refresh via Axios response interceptors.
  - Rate limiting via `express-rate-limit` for link creation, redirection, and auth endpoints.
  - SHA-256 IP address hashing for privacy-friendly analytics tracking.

- **URL Shortener & Analytics**:
  - Long URL validation & custom/random 6-character slug creation.
  - Duplicate slug prevention and reserved keyword enforcement.
  - Fast 302 redirection at `/r/:slug` with device parsing (Mobile vs Desktop vs Tablet) and referrer tracking.
  - Interactive Recharts dark dashboard: AreaChart (Clicks over time), BarChart (Top Referrers), and PieChart (Device breakdown).
  - Searchable, paginated short links management list with quick copy and link deletion.
  - High-resolution downloadable QR Code generator for print and digital media.

- **Link-in-Bio Profile Module**:
  - Public profile page accessible at `/bio/:username`.
  - Dynamic avatar upload (File or URL), display name, and bio description.
  - Dynamic social links editor (GitHub, LinkedIn, Twitter, Portfolio, Resume, YouTube, Instagram, etc.).
  - 3 Selectable bio themes:
    1. **Dark Slate**: Linear-style deep slate `#0B0F17` with glowing indigo accents.
    2. **Minimal Light**: Clean off-white background with refined dark typography.
    3. **Gradient Glow**: Vibrant purple-to-indigo mesh gradient with glassmorphism cards.

---

## Directory Structure

```
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js     # Auth & Password reset logic
│   │   ├── linkController.js     # Short link CRUD & analytics aggregation
│   │   ├── profileController.js  # Profile editor & public bio fetcher
│   │   └── redirectController.js # /r/:slug redirect & telemetry recorder
│   ├── middleware/
│   │   ├── auth.js               # JWT protection middleware
│   │   └── rateLimiter.js        # Express rate limiters
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── ShortLink.js          # ShortLink schema
│   │   └── Click.js              # Click telemetry schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── linkRoutes.js         # /api/links endpoints
│   │   ├── profileRoutes.js      # /api/profile endpoints
│   │   └── redirectRoutes.js     # /r/:slug redirect route
│   ├── utils/
│   │   ├── jwt.js                # JWT token and cookie helper
│   │   ├── hashIp.js             # SHA-256 IP hasher
│   │   └── deviceDetector.js     # User-agent device type parser
│   ├── .env.example              # Sample backend environment variables
│   ├── package.json
│   └── server.js                 # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── bio/              # BioThemes & SocialLinkItem components
    │   │   ├── common/           # Navbar, Footer, SpotlightCard, ProtectedRoute
    │   │   ├── dashboard/        # LinkShortenerForm, LinkList, AnalyticsView, QRCodeModal
    │   │   └── profile/          # ProfileForm & SocialLinksEditor
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global Auth Provider
    │   ├── pages/                # Home, Login, Signup, VerifyEmail, ForgotPassword, ResetPassword, Dashboard, ProfileEdit, PublicBio, NotFound
    │   ├── services/
    │   │   └── api.js            # Axios client with auto token refresh interceptor
    │   ├── App.jsx               # Routes configuration
    │   ├── index.css             # Linear design tokens & ambient styles
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js        # Custom theme tokens & keyframes
    ├── vite.config.js            # Vite configuration with API proxy
    └── package.json
```

---

## Local Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB running locally on `mongodb://127.0.0.1:27017/shortlink_biohub` or a MongoDB Atlas URI.

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory (or copy `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shortlink_biohub
JWT_ACCESS_SECRET=your_jwt_access_secret_key_12345
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_67890
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend development server:

```bash
npm run dev
# Server will run at http://localhost:5000
```

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
# Frontend will run at http://localhost:5173
```

---

## API Documentation

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user & simulate email verification | Public |
| `POST` | `/api/auth/verify-email` | Verify email with token | Public |
| `POST` | `/api/auth/login` | Login user & issue httpOnly JWT cookies | Public |
| `POST` | `/api/auth/logout` | Clear JWT cookies | Public |
| `POST` | `/api/auth/refresh` | Refresh access token using refresh token cookie | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset & simulate token link | Public |
| `POST` | `/api/auth/reset-password` | Reset password using reset token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user data | Private |

#### Sample Request: `POST /api/auth/signup`
```json
{
  "name": "Alex Rivers",
  "email": "alex@example.com",
  "password": "Password123!",
  "username": "alexrivers"
}
```

#### Sample Response:
```json
{
  "success": true,
  "message": "Registration successful! Verification email simulated.",
  "verificationTokenSimulated": "a3b8f1...",
  "user": {
    "id": "660a123...",
    "name": "Alex Rivers",
    "email": "alex@example.com",
    "username": "alexrivers",
    "isEmailVerified": false
  }
}
```

---

### Short Link Endpoints (`/api/links`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/links` | Create short URL (random 6-char or custom slug) | Private |
| `GET` | `/api/links?page=1&limit=6&search=` | List user's short links with search & pagination | Private |
| `GET` | `/api/links/analytics` | Fetch aggregate click analytics for dashboard | Private |
| `DELETE` | `/api/links/:id` | Delete short link and associated click logs | Private |

#### Sample Request: `POST /api/links`
```json
{
  "longUrl": "https://github.com/facebook/react",
  "customSlug": "react-repo"
}
```

#### Sample Response:
```json
{
  "success": true,
  "message": "Short link created successfully",
  "link": {
    "_id": "660b456...",
    "userId": "660a123...",
    "longUrl": "https://github.com/facebook/react",
    "slug": "react-repo",
    "clicksCount": 0,
    "createdAt": "2026-09-21T23:45:00.000Z"
  }
}
```

---

### Redirect Endpoint (`/r/:slug`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/r/:slug` | Asynchronously logs telemetry (referrer, device, hashed IP) and 302 redirects to destination URL | Public |

---

### Bio Profile Endpoints (`/api/profile`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profile/public/:username` | Fetch public bio profile details by username | Public |
| `GET` | `/api/profile/me` | Fetch logged-in user's profile | Private |
| `PUT` | `/api/profile/me` | Update profile avatar, bio, theme, and social links | Private |

---

## Database Schemas

- **Users Collection**: Stores auth credentials, verification/reset tokens, profile bio, social links, and bio theme choice (`dark-slate`, `minimal-light`, `gradient`).
- **ShortLinks Collection**: Stores `userId`, `longUrl`, unique `slug`, and `clicksCount`.
- **Clicks Collection**: Stores `shortLinkId`, `clickedAt`, `referrer`, `deviceType` (`desktop`/`mobile`/`tablet`), and SHA-256 `hashedIp`.
