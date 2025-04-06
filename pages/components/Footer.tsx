import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, MapPin, MessageSquare, Phone, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  // Footer animation variants
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };
  
  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1 * custom,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="bg-gradient-to-b from-black via-black/95 to-black text-white/80 py-20 relative overflow-hidden"
      id="contact"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <motion.div 
            custom={0}
            variants={columnVariants}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-0.5">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"></div>
              </div>
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                Mav<span className="text-white/90">Pads</span>
              </h2>
            </div>
            <p className="text-white/60 max-w-md mb-6">
              Finding the perfect student housing near UTA has never been easier. 
              With MavPads, you can browse, compare, and secure your ideal home.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                aria-label="Facebook" 
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-violet-400 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                aria-label="Twitter" 
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-violet-400 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                aria-label="Instagram" 
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-violet-400 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300"
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            custom={1}
            variants={columnVariants}
          >
            <h3 className="text-lg font-medium mb-6 text-white/90">Useful Links</h3>
            <ul className="space-y-4">
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <Link href="/" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 mr-2"></span>
                  Home
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <Link href="/explore" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 mr-2"></span>
                  Explore Listings
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <Link href="/feedback" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 mr-2"></span>
                  Feedback
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <Link href="/contact" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 mr-2"></span>
                  Contact Us
                </Link>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Contact */}
          <motion.div
            custom={2}
            variants={columnVariants}
          >
            <h3 className="text-lg font-medium mb-6 text-white/90">Contact Us</h3>
            <ul className="space-y-4">
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <a href="tel:+18885550000" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center mr-3 bg-white/5 rounded-xl text-violet-400">
                    <Phone size={16} />
                  </div>
                  <span>(888) 555-0000</span>
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <a href="mailto:contact@mavpads.com" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center mr-3 bg-white/5 rounded-xl text-violet-400">
                    <Mail size={16} />
                  </div>
                  <span>contact@mavpads.com</span>
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <a href="#" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center mr-3 bg-white/5 rounded-xl text-violet-400">
                    <MessageSquare size={16} />
                  </div>
                  <span>Live Chat</span>
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <a href="#" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center mr-3 bg-white/5 rounded-xl text-violet-400">
                    <MapPin size={16} />
                  </div>
                  <span>Arlington, TX</span>
                </a>
              </motion.li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-white/40 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} MavPads. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#" 
              className="text-sm text-white/40 hover:text-violet-400 transition-colors duration-300"
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#" 
              className="text-sm text-white/40 hover:text-violet-400 transition-colors duration-300"
            >
              Terms of Service
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;