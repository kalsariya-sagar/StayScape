# StayScape 🏖️

> A full-stack web application for discovering, listing, and booking unique accommodations worldwide.

StayScape is a modern full-stack vacation rental platform where users can discover unique properties, explore listings through interactive maps, manage wishlists, create reviews, and host their own properties.

---

## 🔗 Project Links

- **Live Demo:** [StayScape](https://stayscape-mocha.vercel.app)
- **GitHub Repository:** [StayScape GitHub](https://github.com/kalsariya-sagar/StayScape)

---

## 📖 Overview

StayScape is designed as a full-stack vacation rental platform inspired by modern accommodation marketplaces.

The application provides separate experiences for visitors, registered users, and hosts while maintaining secure authentication, authorization, session persistence, listing management, reviews, wishlists, image uploads, and interactive map functionality.

---

# ✨ Features & User Roles

## 👤 1. Visitor / Guest

Users who have not logged in can:

- Browse the homepage
- View available listings
- Search destinations
- Filter listings by category
- View listing details
- Explore properties on the map
- View property images and information
- View host information

Protected actions require authentication.

---

## 👤 2. Registered User

Authenticated users can:

- Browse all listings
- Search and filter properties
- View listing details
- Manage their profile
- Add/remove listings from wishlist
- Write reviews
- Manage their reviews
- Create listings
- Become a host
- Manage their account
- Maintain a persistent login session

---

## 🏠 3. Host / Listing Owner

Hosts can:

- Create listings
- Upload listing images
- Edit their own listings
- Delete their own listings
- Manage their properties
- View their listing information
- Manage listing details

A host cannot reserve their own listing.

Authorization rules ensure that users can modify only the resources they are permitted to manage.

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React / React Icons
- Mapbox GL / React Map GL

## Backend

- Node.js
- Express.js
- Express Session
- Connect-Mongo / MongoStore
- bcryptjs
- Mongoose
- Multer
- Multer-Storage-Cloudinary
- Cloudinary
- CORS
- dotenv

## Database

- MongoDB
- MongoDB Atlas
- Mongoose ODM

## Maps & Media

- Mapbox
- Cloudinary

## Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database
- Cloudinary — Image Storage

---

# 🔐 Authentication & Authorization

StayScape uses **session-based authentication**.

The authentication system includes:

- User registration
- User login
- User logout
- Session persistence
- Current-user authentication check
- Protected routes
- Role/resource authorization
- Password hashing with bcryptjs
- Persistent sessions using MongoStore
- HTTP-only session cookies

Authenticated API requests use cookies to maintain the user's session.

---

# 🖥️ Frontend Setup

### 1. Navigate to the client directory

```bash
cd client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend development server

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# ⚙️ Backend Setup

Open another terminal.

### 1. Navigate to the server directory

```bash
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend

```bash
npm run dev
```

The backend API will normally run at:

```text
http://localhost:5000
```

---

# 🌱 Database Seeding

StayScape includes seed data for development.

From the `server/` directory:

```bash
npm run seed
```

The seed script prepares sample users and listings according to the project's seed configuration.

> Seed operations should be used carefully and only against the intended development/test database.

---

# 🧪 Production Build Testing

Before deployment, build the frontend locally:

```bash
cd client
npm run build
```

A successful build should finish without compilation errors.

To test the production build locally:

```bash
npm run preview
```

The Vite preview server will normally be available at:

```text
http://localhost:4173
```

---

# 👨‍💻 Author

**Sagar Kalsariya**

StayScape was designed and developed as a full-stack web development project covering frontend development, backend API architecture, database design, authentication, authorization, third-party integrations, and deployment preparation.

---

# 🙏 Acknowledgments

Built using:

- React
- Vite
- Tailwind CSS
- Node.js
- Express.js
- MongoDB
- Mongoose
- Cloudinary
- Mapbox

---

## ⭐ StayScape

**Discover. Stay. Host.**
