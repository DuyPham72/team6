import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Preload image inside useEffect to run on client-side only
  useEffect(() => {
    const img = new Image();
    img.src = "/Assets/uta_housing.jpeg";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Login successful! Redirecting...");
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-violet-900/30 to-black/70 z-10" />
        <img
          src="/Assets/uta_housing.jpeg"
          alt="UTA Housing"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push("/")}
        className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-black/40 transition-all duration-300"
      >
        <X className="w-6 h-6" />
      </motion.button>

      {/* Login Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md mx-4 bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl text-white z-20 overflow-hidden"
      >
        {/* Gradient header */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
        
        <div className="p-8 sm:p-10">
          {/* Form Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400"
            >
              Welcome Back
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-white/60 text-center mb-8"
            >
              Sign in to access your account
            </motion.p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white/80">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 
                         transition-all duration-300 placeholder:text-white/30"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white/80">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 
                         transition-all duration-300 placeholder:text-white/30"
                placeholder="Enter your password"
                required
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 
                       hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-lg 
                       transition-all duration-300 shadow-lg shadow-violet-600/20 font-medium
                       focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              Log In
            </motion.button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-white/60"
          >
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 hover:underline transition-colors duration-300"
            >
              Sign Up
            </button>
          </motion.p>
        </div>
        
        {/* Decorative Element */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.8 } }}
          className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-violet-500/10 to-transparent pointer-events-none"
        />
      </motion.div>
    </div>
  );
}