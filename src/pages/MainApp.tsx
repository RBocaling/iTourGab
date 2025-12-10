import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DesktopNavigation from "@/components/layout/DesktopNavigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import HomePage from "./HomePage";
import MapPage from "./MapPage";
import SpotDetailsPage from "./SpotDetailsPage";
import BookingPage from "./BookingPage";
import BookingsPage from "./BookingsPage";
import ProfilePage from "./ProfilePage";
import ItineraryPage from "./ItineraryPage";
import FavoritesPage from "./FavoritesPage";
import SearchPage from "./SearchPage";
import RatingsPage from "./RatingsPage";
import PublicChats from "./PublicChats";
import MobileHeader from "@/components/layout/MobileHeader";
import { useAuth2 } from "@/hooks/useAuth";
import RankingPlace from "./RankingPlace";
import Hotlines from "./Hotlines";
import ChatAi from "./ChatAi";

const MainApp: React.FC = () => {
  const { user, isAuthenticated } = useAuth2();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  },[isAuthenticated])

  return (
    <div className="min-h-screen bg-background pt-20 md:p-0 ">
      {!isAuthenticated ? (
        <main className="min-h-screen bg-gradient-hero">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      ) : (
        <main className="relative ">
          <DesktopNavigation />
          <MobileHeader />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/emergency-safe-hotlines" element={<Hotlines />} />
            <Route path="/ai-support" element={<ChatAi />} />
            <Route path="/ranking-spot" element={<RankingPlace />} />
            <Route path="/spot/:spotId" element={<SpotDetailsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/gabaldon-public-socials" element={<PublicChats />} />
            <Route path="/ratings/:spotId" element={<RatingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNavigation />
        </main>
      )}
    </div>
  );
};

export default MainApp;
