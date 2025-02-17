import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Login() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/Assets/uta_housing.jpeg" // Ensure this image exists in the public/Assets folder
          alt="UTA Housing"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black/40"></div> {/* Overlay for better text visibility */}
      </div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-6 bg-black/30 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold text-white">
          <Image src="/Assets/uta_logo.png" alt="UTA Logo" width={50} height={50} />
          <span>UTA Housing</span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link href="/" className="text-white hover:text-orange-500 transition duration-300">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-orange-500 transition duration-300">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-orange-500 transition duration-300">
            Contact
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          <Link href="/login">
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition duration-300">
              Log In
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 bg-black/30 backdrop-blur-sm rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Log In</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-black/20 border border-white/30 rounded focus:outline-none focus:border-orange-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-black/20 border border-white/30 rounded focus:outline-none focus:border-orange-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition duration-300"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-orange-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}