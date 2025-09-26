import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DesktopNavigation from '@/components/layout/DesktopNavigation';
import BottomNavigation from '@/components/layout/BottomNavigation';
import NatureSoundButton from '@/components/layout/NatureSoundButton';
import ModernLogin from '@/components/auth/ModernLogin';
import HomePage from './HomePage';
import MapPage from './MapPage';
import SpotDetailsPage from './SpotDetailsPage';
import BookingPage from './BookingPage';
import BookingsPage from './BookingsPage';
import ProfilePage from './ProfilePage';
import ItineraryPage from './ItineraryPage';
import FavoritesPage from './FavoritesPage';
import SearchPage from './SearchPage';
import RatingsPage from './RatingsPage';
import AdminDashboard from './admin/AdminDashboard';
import BusinessDashboard from './business/BusinessDashboard';
import PublicChats from './PublicChats';
import MobileHeader from '@/components/layout/MobileHeader';

const MainApp: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(!isAuthenticated);

  const handleLogin = (userData: any) => {
    login(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    logout();
    setShowLogin(true);
  };

  if (!isAuthenticated || showLogin) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        {/* <NatureSoundButton /> */}
        <ModernLogin 
          onLogin={handleLogin} 
          onClose={() => setShowLogin(false)} 
        />
      </div>
    );
  }

  // Route based on user role
  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <DesktopNavigation user={user} onLogout={handleLogout} />
        <NatureSoundButton />
        <AdminDashboard />
      </div>
    );
  }

  if (user?.role === 'business') {
    return (
      <div className="min-h-screen bg-background">
        <DesktopNavigation user={user} onLogout={handleLogout} />
        <NatureSoundButton />
        <BusinessDashboard />
      </div>
    );
  }

  // Default user (tourist) routes
  return (
    <div className="min-h-screen bg-background pt-20 md:p-0 ">
      <DesktopNavigation user={user} onLogout={handleLogout} />
      {/* <NatureSoundButton /> */}
      <MobileHeader />

      <main className="relative ">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/spot/:spotId" element={<SpotDetailsPage />} />
          <Route path="/booking/:spotId?" element={<BookingPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/gabaldon-public-socials" element={<PublicChats />} />
          <Route path="/ratings/:spotId" element={<RatingsPage />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default MainApp;