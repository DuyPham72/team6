import { motion } from "framer-motion";

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
      {/* Decorative element similar to navbar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute top-0 right-0 w-full h-40 bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none"
      />
      
      <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <motion.div 
            custom={0}
            variants={columnVariants}
            className="md:col-span-2"
          >
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Mav<span className="text-white/90">Pads</span>
            </h2>
            <p className="text-white/60 max-w-md">
              Finding the perfect student housing near UTA has never been easier. 
              With MavPads, you can browse, compare, and secure your ideal home.
            </p>
            <div className="mt-6 flex space-x-4">
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                aria-label="Facebook" 
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-violet-400 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                aria-label="Twitter" 
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-violet-400 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#" 
                aria-label="Instagram" 
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-violet-400 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </motion.a>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            custom={1}
            variants={columnVariants}
          >
            <h3 className="text-lg font-medium mb-4 text-white/90">Useful Links</h3>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <a href="#home" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 mr-2"></span>
                  Home
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <a href="./components/explore" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 mr-2"></span>
                  Explore Listing
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <a href="#team" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 mr-2"></span>
                  Our Team
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <a href="./components/contact" className="text-white/60 hover:text-violet-400 transition-colors duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 mr-2"></span>
                  Contact Us
                </a>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Contact */}
          <motion.div
            custom={2}
            variants={columnVariants}
          >
            <h3 className="text-lg font-medium mb-4 text-white/90">Contact Us</h3>
            <ul className="space-y-3 text-white/60">
              <li className="flex items-start">
                <div className="w-8 h-8 flex items-center justify-center mr-3 bg-white/5 rounded-lg text-violet-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <span>(888) 555-0000</span>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 flex items-center justify-center mr-3 bg-white/5 rounded-lg text-violet-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <span>contact@mavpads.com</span>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 flex items-center justify-center mr-3 bg-white/5 rounded-lg text-violet-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <span>MavPads</span>
              </li>
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
            <a href="#" className="text-sm text-white/40 hover:text-violet-400 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-sm text-white/40 hover:text-violet-400 transition-colors duration-300">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;