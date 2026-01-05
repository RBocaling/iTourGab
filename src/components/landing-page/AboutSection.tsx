import { Shield, Leaf, Heart, Mountain } from "lucide-react";

const features = [
  {
    icon: Mountain,
    title: "Natural Wonders",
    description: "Explore pristine waterfalls, caves, and mountain trails untouched by urban development.",
  },
  {
    icon: Leaf,
    title: "Eco-Tourism",
    description: "Support sustainable tourism practices that preserve our natural heritage for future generations.",
  },
  {
    icon: Heart,
    title: "Warm Hospitality",
    description: "Experience the genuine warmth and hospitality of the Gabaldeño people.",
  },
  {
    icon: Shield,
    title: "Safe Adventures",
    description: "Enjoy well-maintained trails and guided tours ensuring your safety throughout.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full gradient-sky-subtle opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              About Gabaldon
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Where Nature Meets
              <span className="block text-gradient">Adventure</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Nestled in the foothills of the Sierra Madre mountain range,
              Gabaldon is a first-class municipality in Nueva Ecija known for
              its rich biodiversity, stunning landscapes, and vibrant cultural
              heritage. From cascading waterfalls to terraced rice fields, every
              corner tells a story of nature's magnificence.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl gradient-sky flex items-center justify-center shrink-0 shadow-sky">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-sky-lg h-48">
                  <img
                    src="https://res.cloudinary.com/dcnberczq/image/upload/v1766512929/Screenshot_2025-11-13_110933_e6beiy.png"
                    alt="Scenic river view"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-sky-lg h-64">
                  <img
                    src="https://res.cloudinary.com/dcnberczq/image/upload/v1766512519/Screenshot_2025-11-13_111444_gfbqhi.png"
                    alt="Mountain landscape"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-3xl overflow-hidden shadow-sky-lg h-64">
                  <img
                    src="https://res.cloudinary.com/dcnberczq/image/upload/v1766512740/Screenshot_2025-11-13_112659_kuhriy.png"
                    alt="Green hills"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-sky-lg h-48">
                  <img
                    src="https://res.cloudinary.com/dcnberczq/image/upload/v1766513832/Screenshot_2025-11-14_111854_vl37zk.png"
                    alt="Foggy mountains"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 glass-strong rounded-2xl p-6 shadow-sky-lg">
              <p className="text-3xl font-bold text-gradient">Since 1949</p>
              <p className="text-sm text-muted-foreground">
                Welcoming Travelers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
