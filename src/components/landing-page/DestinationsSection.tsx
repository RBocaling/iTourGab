import SpotCard from "./SpotCard";
import waterfallImage from "@/assets/waterfall.jpg";
import riceTerraceImage from "@/assets/rice-terraces.jpg";
import mountainImage from "@/assets/mountain-trail.jpg";
import hotSpringImage from "@/assets/hot-spring.jpg";
import useGetPlacePublic from "@/hooks/usePublicPlace";
import Loader from "../loader/Loader";


const DestinationsSection = () => {
  const { data: touristSpots, isLoading } = useGetPlacePublic();
  if (isLoading) {
    return <Loader/>
  }
  
  console.log("touristSpots", touristSpots);
  
  return (
    <section id="destinations" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Popular Destinations
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore <span className="text-gradient">Must-Visit</span> Spots
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover the most breathtaking natural wonders that Gabaldon has to offer. 
            Each destination promises an unforgettable experience.
          </p>
        </div>

        {/* Spots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {touristSpots?.map((spot, index) => (
            <SpotCard
              key={spot.id}
              {...spot}
              delay={index * 100}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all duration-300">
            View All Destinations
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
