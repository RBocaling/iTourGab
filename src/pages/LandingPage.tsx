import Navbar from "@/components/landing-page/Navbar";
import HeroSection from "@/components/landing-page/HeroSection";
import DestinationsSection from "@/components/landing-page/DestinationsSection";
import AboutSection from "@/components/landing-page/AboutSection";
import Footer from "@/components/landing-page/Footer";
import DownloadPopup, { useDownloadPopup } from "@/components/landing-page/DownloadPopup";
import TourismFAQ from "@/components/landing-page/TouristFaq";
import Seo from "@/seo/Seo";

const Index = () => {
  const { showPopup, closePopup } = useDownloadPopup();

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="ITOURGAB – Discover Tourist Spots in the Philippines | Gabaldon Nueva Ecija Attractions"
        description="Explore top tourist spots, natural attractions, resorts, and travel experiences in the Philippines, including popular destinations in Gabaldon, Nueva Ecija."
        canonical="https://itourgab-v1.site/welcome-to-i-tour-gab"
      />

      <Navbar />
      <main>
        <HeroSection />
        <DestinationsSection />
        <AboutSection />
        <TourismFAQ />
      </main>
      <Footer />
      {showPopup && <DownloadPopup onClose={closePopup} />}
    </div>
  );
};

export default Index;
