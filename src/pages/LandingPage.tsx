import { motion } from "framer-motion";
import { MapPin, Camera, Star, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroLandscape from "@/assets/hero-landscape.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Interactive 3D Maps",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint, doloremque.",
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Multimedia Galleries",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint, doloremque.",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Smart Itineraries",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint, doloremque",
    },
  ];

  const testimonials = [
    {
      name: "Maria Santos",
      comment:
        "iTourGab made our family trip to Gabaldon absolutely amazing! The interactive maps and recommendations were spot on.",
      rating: 5,
    },
    {
      name: "Juan Dela Cruz",
      comment:
        "As a local business owner, this platform has been incredible for connecting with tourists and showcasing our services.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gradient-primary flex items-center"
            >
              <img src="/logo-itour.png" className="w-16" alt="" />
              iTourGab
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-x-4 flex items-center"
            >
              <Button className="btn-hero" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 parallax-hero"
          style={{
            backgroundImage: `url(${heroLandscape})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/20" />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="floating-element">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Discover
                <span className="text-gradient-primary block">Gabaldon</span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Your gateway to the hidden gems of Nueva Ecija. Explore pristine
              rivers, majestic mountains, and unforgettable experiences with our
              smart travel platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                className="bg-gradient-primary text-lg px-8 py-4 w-[70%] h-12"
                onClick={() => navigate("/")}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Exploring
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border border-primary w-[70%] text-lg px-8 py-4 h-12 text-primary bg-primary/10"
                onClick={() => navigate("/login")}
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-background to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
              Why Choose iTourGab?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of travel planning with our cutting-edge
              features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="card-modern p-8 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="bg-gradient-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-nature mb-6">
              Loved by Travelers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card-modern p-8"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-lg mb-4 italic">"{testimonial.comment}"</p>
                <p className="font-semibold text-primary">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Explore Gabaldon?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of travelers discovering the beauty of Nueva Ecija
            </p>
            <Button
              className="btn-glass text-lg px-8 py-4 h-12"
              onClick={() => navigate("/")}
            >
              Start Your Journey Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-3xl font-bold mb-4">iTourGab</div>
            <p className="text-white/70 mb-8">
              Discover. Explore. Experience. Gabaldon, Nueva Ecija.
            </p>
            <div className="flex justify-center space-x-8">
              <Button variant="link" className="text-white hover:text-primary">
                About
              </Button>
              <Button variant="link" className="text-white hover:text-primary">
                Contact
              </Button>
              <Button variant="link" className="text-white hover:text-primary">
                Privacy
              </Button>
              <Button variant="link" className="text-white hover:text-primary">
                Terms
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
