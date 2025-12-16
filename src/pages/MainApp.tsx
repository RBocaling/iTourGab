// src/pages/MainApp.tsx
import React, { useEffect } from "react";
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
import TermsModal from "@/components/ui/TermsCondition";
import useTermsStore from "@/store/termsStore";

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth2();
  const navigate = useNavigate();
  const { isOpen, accepted, open, close, accept, loadFromStorage } =
    useTermsStore();

  useEffect(() => {
    if (!isAuthenticated) {
      // navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!isAuthenticated) {
      close();
      return;
    }
    if (!accepted) open();
  }, [isAuthenticated, accepted, open, close]);

  return (
    <div className="min-h-screen md:bg-background md:p-0">
      {!isAuthenticated ? (
        <main className="min-h-screen md:bg-gradient-hero">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      ) : (
        <main className="relative pt-20 md:pt-0">
          <DesktopNavigation />
          <MobileHeader />

          <TermsModal
            open={isOpen}
            onClose={close}
            onAccept={accept}
            title="iTourGab — Terms & Conditions"
          />

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
