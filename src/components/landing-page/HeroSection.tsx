import { Button } from "@/components/ui/button";
import { ArrowRight, Play, MapPin, Users, Camera } from "lucide-react";
import heroImage from "/hero-bg.jpg";
import { useNavigate } from "react-router-dom";
import useGetPlacePublic from "@/hooks/usePublicPlace";
import Loader from "../loader/Loader";

const HeroSection = () => {
  const navigate = useNavigate();
  const { data: touristSpots, isLoading } = useGetPlacePublic();
  if (isLoading) {
    return <Loader />;
  }
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-start md:items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful landscape of Gabaldon Nueva Ecija"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div
        className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-sky-dark/10 rounded-full blur-3xl animate-pulse-soft"
        style={{ animationDelay: "1s" }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-slide-up">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Gabaldon, Nueva Ecija · Philippines
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Tourist Spots in Gabaldon
            <span className="block text-gradient">
              Nueva Ecija, Philippines
            </span>
          </h1>

          {/* Description */}
          <p
            className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            Discover waterfalls, mountain views, rice terraces, resorts, and
            natural attractions in Gabaldon, Nueva Ecija. Explore hidden
            destinations and experience eco-tourism in the heart of the Sierra
            Madre.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <Button variant="gradient" size="xl">
              Explore Tourist Spots
              <ArrowRight className="w-5 h-5" />
            </Button>

            <Button variant="glass" onClick={() => navigate("/")} size="xl">
              <Play className="w-5 h-5" />
              Get Started – Explore the App
            </Button>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap gap-8 animate-slide-up"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {touristSpots?.length}+
                </p>
                <p className="text-sm text-muted-foreground">Tourist Spots</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {touristSpots?.reduce(
                    (acc: number, item: any) => acc + item?.totalViews,
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Total Visitors</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {" "}
                  {touristSpots?.reduce(
                    (acc: number, item: any) => acc + item?.totalImages,
                    0
                  )}
                  +
                </p>
                <p className="text-sm text-muted-foreground">Photo Spots</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
