import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import ListingDetailsPage from './pages/ListingDetailsPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserProfilePage from './pages/UserProfilePage';
import WishlistPage from './pages/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 antialiased font-sans">
      <Navbar />
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings/:id" element={<ListingDetailsPage />} />
          <Route
            path="/listings/new"
            element={
              <ProtectedRoute>
                <CreateListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings/:id/edit"
            element={
              <ProtectedRoute>
                <EditListingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/users/:id" element={<UserProfilePage />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;