import { motion } from "framer-motion";
import { toast } from "sonner";

const HeroSection = () => {
  // Hero section animation variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.8,
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      id="home"
      initial="hidden"
      animate="visible"
      variants={heroVariants}
      className="relative min-h-screen flex items-center pt-20"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-violet-900/70 z-10" />
      </div>

      {/* Decorative elements similar to the navbar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-violet-500/20 to-transparent pointer-events-none"
      />

      {/* Hero Content */}
      <div className="container relative z-20 mx-auto px-6 md:px-10">
        <motion.div
          className="text-center max-w-3xl mx-auto"
        >
          <motion.span 
            variants={itemVariants}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-white/90 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
          >
            Student Housing Made Simple
          </motion.span>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400 mb-6 tracking-tight"
          >
            Welcome to MavPads
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Find your perfect home near campus with our curated selection of student accommodations
          </motion.p>

          <motion.div variants={itemVariants}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.href = "./components/explore";
                toast("Exploring listings... Loading available properties near UTA");
              }}
              className="px-8 py-4 bg-gradient-to-br from-violet-600/90 to-fuchsia-600/90 hover:from-violet-500/90 hover:to-fuchsia-500/90 text-white rounded-full transition-all duration-300 shadow-lg shadow-violet-600/20 backdrop-blur-sm border border-white/10 hover:border-white/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-2">
                Explore Listings
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;