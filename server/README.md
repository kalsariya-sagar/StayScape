# StayScape — Backend Server

The RESTful API engine powering **StayScape**, built with Node.js, Express, MongoDB, and Mongoose. Handles authentication, authorization, session persistence, data modeling, file uploads, and business logic.

---

## 🛠 Tech Stack

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas via Mongoose ODM
* **Authentication & Sessions:** Express Session, MongoStore (for persistent production sessions), bcryptjs
* **File Uploads & Storage:** Multer, Multer-Storage-Cloudinary, Cloudinary SDK
* **Security & Utilities:** CORS, Dotenv

---

## ✨ Features

- User registration
- User login and logout
- Session-based authentication
- Persistent sessions using MongoStore
- Protected API routes
- User profile management
- Listing creation
- Listing editing
- Listing deletion
- Listing ownership authorization
- Listing search
- Category filtering
- Geospatial listing data
- Wishlist management
- Reviews and ratings
- Review authorization
- Cloudinary image uploads
- MongoDB data persistence
- Input validation
- Error handling
- CORS configuration
- Production-ready session cookies

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` directory based on `.env.example`.

```env
# Server Running Port
PORT=5000

# Node Environment
NODE_ENV=development

# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/stayscape

# Session Secret
SESSION_SECRET=your_super_secret_session_key_here

# Frontend Application URL
CLIENT_URL=http://localhost:5173

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

> Never commit the real `server/.env` file to GitHub.

> Replace all placeholder values with your actual development or production credentials.

---

## 🚀 Local Development Setup

### 1. Navigate to the server directory

```bash
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
server/.env
```

Add the required variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/stayscape
SESSION_SECRET=your_super_secret_session_key_here
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

---

## 🌱 Seed the Database

StayScape includes seed data for development.

From the `server/` directory, run:

```bash
npm run seed
```

The seed process can create sample users and listings required for local development and testing.

> Run the seed command only when you want to initialize or update the development seed data according to the project's seed logic.

---

## ▶️ Start the Development Server

Start the backend with hot-reloading:

```bash
npm run dev
```

The backend API will run on:

```text
http://localhost:5000
```

---

## 🏗️ Production Start

For a production environment, first configure the production environment variables and then start the server using the production command defined in `package.json`.

Typical command:

```bash
npm start
```

---

## 👨‍💻 Project

**StayScape — Full-Stack Vacation Rental Platform**

The backend provides the REST API, authentication, authorization, session management, database operations, listing management, reviews, wishlist functionality, image uploads, and business logic required by the StayScape frontend.