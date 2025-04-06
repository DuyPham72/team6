import { motion } from "framer-motion";
import { ArrowRight, Home, MapPin, Star } from "lucide-react";
import { useToast } from "./ui/ToastContext";
import { useRouter } from "next/router";
import { useState } from "react";
import MapModal from "./MapModal";

const HeroSection = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Hero section animation variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const stats = [
    { label: "Housing Options", value: "12+" },
    { label: "Average Rating", value: "4.5" },
    { label: "Locations", value: "5+" }
  ];

  const handleExploreClick = () => {
    showToast("Exploring listings... Loading available properties near UTA", "info");
    router.push("/components/explore");
  };

  const handleMapClick = () => {
    setIsMapOpen(true);
  };

  return (
    <>
      <motion.section 
        id="home"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-violet-900/70 z-10" />
        </div>

        {/* Main Content */}
        <div className="container relative z-20 mx-auto px-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={itemVariants}
              className="text-center mb-12"
            >
              <motion.span 
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-white/90 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <Home className="w-4 h-4" />
                Student Housing Made Simple
              </motion.span>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-7xl font-bold mb-8 tracking-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400">
                  Welcome to MavPads
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Find your perfect home near campus with our curated selection of student accommodations
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              >
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExploreClick}
                  className="group relative px-8 py-4 bg-gradient-to-br from-violet-600/90 to-fuchsia-600/90 hover:from-violet-500/90 hover:to-fuchsia-500/90 text-white rounded-full transition-all duration-300 shadow-lg shadow-violet-600/20 backdrop-blur-sm border border-white/10 hover:border-white/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center justify-center gap-2">
                    Explore Listings
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMapClick}
                  className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
                >
                  <span className="flex items-center justify-center gap-2">
                    <MapPin className="w-5 h-5" />
                    View Map
                  </span>
                </motion.button>
              </motion.div>

              {/* Stats Section */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-white/60 text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Bottom Gradient */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-violet-500/20 to-transparent pointer-events-none"
        />
      </motion.section>

      <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </>
  );
};

export default HeroSection;