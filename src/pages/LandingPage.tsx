import Navbar from "@/components/landing-page/Navbar";
import HeroSection from "@/components/landing-page/HeroSection";
import DestinationsSection from "@/components/landing-page/DestinationsSection";
import AboutSection from "@/components/landing-page/AboutSection";
import Footer from "@/components/landing-page/Footer";
import DownloadPopup, { useDownloadPopup } from "@/components/landing-page/DownloadPopup";

const Index = () => {
  const { showPopup, closePopup } = useDownloadPopup();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <DestinationsSection />
        <AboutSection />
      </main>
      <Footer />
      {showPopup && <DownloadPopup onClose={closePopup} />}
    </div>
  );
};

export default Index;
