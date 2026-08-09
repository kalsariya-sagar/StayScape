# StayScape — Frontend Client

The user-facing Single Page Application (SPA) for **StayScape**, built with React, Vite, and Tailwind CSS. It provides an interactive interface for browsing vacation rentals, viewing interactive maps, writing reviews, and managing user profiles and listings.

---

## 🛠 Tech Stack

* **Core Framework:** React 18 (via Vite)
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS, PostCSS, Autoprefixer
* **Icons:** Lucide React / React Icons
* **Maps & Geocoding:** Mapbox GL / React Map GL
* **HTTP Client:** Axios (configured with `withCredentials: true` for cookie-based session management)

---

## ⚙️ Environment Variables

Create a `.env` file inside the `client/` directory based on `.env.example`.

```env
# URL where your Express backend server is running
VITE_API_URL=http://localhost:5000/api

# Mapbox Public Access Token for map rendering
VITE_MAPBOX_TOKEN=your_mapbox_public_token_here
```

---

## 🚀 Getting Started

### 1. Navigate to the client directory

```bash
cd client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
client/.env
```

Add the required variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=your_mapbox_public_token_here
```

> Use your actual Mapbox public token in the local `.env` file.

### 4. Start the local development server

```bash
npm run dev
```

The application will typically run at:

```text
http://localhost:5173
```

---

## 🏗️ Production Build

Create an optimized production build with:

```bash
npm run build
```

The generated production files will be placed inside:

```text
client/dist/
```

> `dist/` is a generated build directory and should not be committed to GitHub.

---

## 🔍 Preview Production Build

To test the production build locally:

```bash
npm run preview
```

The Vite preview server will typically run at:

```text
http://localhost:4173
```

---

## 👨‍💻 Project

**StayScape — Full-Stack Vacation Rental Platform**

The frontend provides the user-facing experience for discovering accommodations, interacting with maps, managing accounts, creating listings, managing properties, and interacting with reviews and wishlists.