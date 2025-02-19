import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/router"; // Use Next.js's useRouter for routing
import { useEffect, useState } from "react"; // Use useEffect for client-side operations
import toast from "react-hot-toast"; // Ensure react-hot-toast is imported correctly

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();  // Initialize the router hook

  // Preload image using useEffect (only on client-side)
  useEffect(() => {
    const img = new Image();
    img.src = "/Assets/uta_housing.jpeg"; // Preload image for performance
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email domain
    if (!email.endsWith("@mavs.uta.edu")) {
      toast.error("Only mavs.uta.edu emails are allowed.");
      return;
    }

    // Validate password length
    if (password.length <= 6) {
      toast.error("Password must be longer than 6 characters.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
    
      if (response.ok) {
        toast.success("Sign-up successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000); // Use router.push() for navigation
      } else {
        toast.error(data.message || "Sign-up failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/Assets/uta_housing.jpeg')" }}>
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        onClick={() => router.push("/")}  // Use router.push() for navigation
        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 text-white hover:bg-black/30 transition-all duration-300"
      >
        <X className="w-6 h-6" />
      </motion.button>

      {/* Sign Up Form Container */}
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
            Create Account
          </h2>
          <p className="text-white/60 text-center mb-8">
            Join UTA Housing to find your perfect home
          </p>
        </motion.div>

        {/* Sign Up Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-white/80">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 
                       transition-all duration-300 placeholder:text-white/30"
              placeholder="Enter your full name"
              required
            />
          </div>

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
              placeholder="Enter your mavs.uta.edu email"
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
            {passwordError && (
              <p className="text-red-400 text-sm mt-2">{passwordError}</p>
            )}
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
            Sign Up
          </motion.button>
        </motion.form>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-6 text-center text-white/60"
        >
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}  // Use router.push() for navigation
            className="text-orange-400 hover:text-orange-300 hover:underline transition-colors duration-300"
          >
            Log In
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}
