import { motion } from "framer-motion";
import Link from "next/link"; // Use next/link for navigation
import { useRouter } from "next/router"; // Replace react-router-dom with next/router
import { useEffect } from "react";

const NotFound = () => {
  const router = useRouter(); // Use next/router to access the current path

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      router.asPath // Use router.asPath to get the current path
    );
  }, [router.asPath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-mavpads-light-gray px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-mavpads-orange bg-mavpads-orange/10 rounded-full">
            404 Error
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold text-mavpads-dark mb-4"
        >
          Page Not Found
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-mavpads-gray mb-8 max-w-md mx-auto"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/" // Use href instead of to
            className="px-8 py-4 bg-mavpads-orange text-white rounded-full inline-block transform transition-all duration-300 hover:scale-105 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;