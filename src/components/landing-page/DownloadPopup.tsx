import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";

interface DownloadPopupProps {
  onClose: () => void;
}

const DownloadPopup = ({ onClose }: DownloadPopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md glass-strong rounded-3xl p-8 shadow-sky-lg animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl gradient-sky flex items-center justify-center shadow-glow">
            <Smartphone className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            Get the iTourGab App
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Explore Gabaldon's breathtaking tourist spots with our mobile app. 
            Get offline maps, guides, and exclusive deals!
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 space-y-3">
          <Button 
            variant="gradient" 
            size="lg" 
            className="w-full"
            onClick={() => window.open('#download', '_blank')}
          >
            <Download className="w-5 h-5" />
            Download Now
          </Button>
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full text-muted-foreground"
            onClick={onClose}
          >
            Maybe Later
          </Button>
        </div>

        {/* App store badges hint */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Available on iOS & Android
        </p>
      </div>
    </div>
  );
};

export const useDownloadPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("itourgab_visited");
    
    if (!hasVisited) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setShowPopup(true);
        localStorage.setItem("itourgab_visited", "true");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => setShowPopup(false);

  return { showPopup, closePopup, DownloadPopup };
};

export default DownloadPopup;
