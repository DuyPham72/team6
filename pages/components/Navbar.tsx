import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Home, MessageSquare, Search, Users, Bookmark } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
//import { HousingOption, housingOptions } from "./explore"; // Ensure this import is correct
import { HousingListing, housingListings } from "../../lib/services/housingService";

interface NavbarProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function Navbar({ setIsMenuOpen }: NavbarProps) {
  const { isSignedIn, user } = useUser();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HousingListing[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
    setIsMenuOpen(!isMenuOpen); // Notify parent component to apply the blur effect
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const results = housingListings.filter((housing: HousingListing) =>
        housing.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsDropdownVisible(true);
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/50 backdrop-blur-xl" : "bg-black/30 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:px-10">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-0.5">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm group-hover:bg-black/10 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400">
              MavPads
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="relative flex-grow mx-4">
          <div className="flex-grow mx-8 max-w-xl relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-hover:text-violet-400 transition-colors duration-300" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for housing..."
              className="w-full py-2.5 pl-10 pr-4 bg-white/5 text-white placeholder:text-white/40 border border-white/10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:bg-white/10 backdrop-blur-sm"
            />
            {isDropdownVisible && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-black/80 backdrop-blur-xl rounded-xl mt-2 z-10 border border-white/10 shadow-lg shadow-violet-500/10">
                {searchResults.map((result, index) => (
                  <Link key={index} href={`/housing/${result.id}`}>
                    <div className="px-4 py-3 text-white/90 hover:bg-white/10 transition-colors duration-200 cursor-pointer first:rounded-t-xl last:rounded-b-xl">
                      {result.title}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition duration-300 flex items-center gap-2 backdrop-blur-sm border border-white/5 hover:border-white/10"
            >
              <Home size={18} />
              <span>Home</span>
            </motion.button>
          </Link>

          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition duration-300 flex items-center gap-2 backdrop-blur-sm border border-white/5 hover:border-white/10"
            >
              <Users size={18} />
              <span>Contact</span>
            </motion.button>
          </Link>

          <Link href="/feedback">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition duration-300 flex items-center gap-2 backdrop-blur-sm border border-white/5 hover:border-white/10"
            >
              <MessageSquare size={18} />
              <span>Feedback</span>
            </motion.button>
          </Link>

          <Link href="/saved">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition duration-300 flex items-center gap-2 backdrop-blur-sm border border-white/5 hover:border-white/10"
            >
              <Bookmark size={18} />
              <span>Saved</span>
            </motion.button>
          </Link>

          <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1"></div>

          {isSignedIn ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-white/80 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/5">
                  Hello, {user?.firstName || "User"}
                </span>
                <div className="rounded-full overflow-hidden border border-white/5">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full transition duration-300 backdrop-blur-sm"
                >
                  Sign In
                </motion.button>
              </SignInButton>

              <SignUpButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-br from-violet-600/90 to-fuchsia-600/90 hover:from-violet-500/90 hover:to-fuchsia-500/90 text-white rounded-full transition duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg shadow-violet-600/20"
                >
                  Sign Up
                </motion.button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
