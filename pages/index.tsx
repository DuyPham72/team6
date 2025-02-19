import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "./components/Navbar";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // No need to use useToaster, use toast directly

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.src = "/Assets/uta_housing.jpeg";
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1A1F2C]">
      <Navbar setIsMenuOpen={setIsMenuOpen} />

      {/* Main Content with Backdrop Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          filter: isMenuOpen ? "blur(8px)" : "blur(0px)",
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10" />
          <img
            src="/Assets/uta_housing.jpeg"
            alt="UTA Housing"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-white/90 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              Student Housing Made Simple
            </span>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
            >
              Welcome to UTA Housing
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Find your perfect home near campus with our curated selection of student accommodations
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <button 
                onClick={() => {
                  window.location.href = "./components/explore";
                  toast("Exploring listings... Loading available properties near UTA");
                }}
                className="px-8 py-4 bg-orange-500 text-white rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-black/50"
              >
                Explore Listings
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;