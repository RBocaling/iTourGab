import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EmergencyHotlineCards from "@/components/emergency/EmergencyHotlineCards";
import { defaultEmergencyHotlines } from "@/data/emergencyHotlines";

const LANDING_HOTLINE_LIMIT = 5;

export default function EmergencyHotlinesSection() {
  const preview = defaultEmergencyHotlines.slice(0, LANDING_HOTLINE_LIMIT);

  return (
    <section
      id="emergency-hotlines"
      className="scroll-mt-24 md:scroll-mt-28 bg-slate-50 py-16 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Emergency Hotlines
            </h2>
            <p className="mt-2 text-muted-foreground text-lg max-w-2xl">
              Quick access to emergency contacts and safety support
            </p>
          </header>

          <EmergencyHotlineCards hotlines={preview} />

          <div className="flex justify-center mt-10">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/app/emergency-safe-hotlines">View All</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
