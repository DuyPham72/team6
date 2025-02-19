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
    img.src = "/Assets/uta_housing.jpeg"; // Preload image for performance
  }, []); // Empty dependency array to run only once after initial render

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
        toast.success("Login successful! Redirecting...", {
          className: "bg-green-500 border-green-600 text-white",
        });
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(data.message || "Something went wrong", {
          className: "bg-red-500 border-red-600 text-white",
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        className: "bg-red-500 border-red-600 text-white",
      });
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[#1A1F2C] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10" />
        <img
          src="/Assets/uta_housing.jpeg"
          alt="UTA Housing"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Close Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        onClick={() => router.push("/")}
        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 text-white hover:bg-black/30 transition-all duration-300"
      >
        <X className="w-6 h-6" />
      </motion.button>

      {/* Login Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md mx-4 p-8 sm:p-10 bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl text-white z-20"
      >
        {/* Form Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-orange-400">
            Welcome Back
          </h2>
          <p className="text-white/60 text-center mb-8">
            Sign in to access your account
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white/80">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 
                       transition-all duration-300 placeholder:text-white/30"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white/80">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 
                       transition-all duration-300 placeholder:text-white/30"
              placeholder="Enter your password"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg 
                     hover:bg-orange-600 transform transition-all duration-300 
                     focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 
                     focus:ring-offset-black/50"
          >
            Log In
          </motion.button>
        </motion.form>

        {/* Sign Up Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-6 text-center text-white/60"
        >
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-orange-400 hover:text-orange-300 hover:underline transition-colors duration-300"
          >
            Sign Up
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}
