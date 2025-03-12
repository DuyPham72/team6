import { AnimatePresence, motion } from "framer-motion";
import { Home, LogOut, Menu, MessageSquare, Search, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HousingOption, housingOptions } from "./explore"; // Ensure this import is correct

interface NavbarProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function Navbar({ setIsMenuOpen }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HousingOption[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.username || "User");
      } catch (error) {
        setUserName("User");
      }
    }

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    window.location.href = "/";
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    console.log("Search query:", query); // Debugging
    setSearchQuery(query);

    if (query.length > 2) {
      const results = housingOptions.filter((housing: HousingOption) =>
        housing.name.toLowerCase().includes(query.toLowerCase())
      );
      console.log("Search results:", results); // Debugging
      setSearchResults(results);
      setIsDropdownVisible(true);
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };

  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.classList.add("ring-2", "ring-violet-500/50");
    }
  };

  const handleSearchBlur = () => {
    if (searchInputRef.current) {
      searchInputRef.current.classList.remove("ring-2", "ring-violet-500/50");
    }
  };

  // Navbar animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Menu item animation variants
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 * custom,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/50 backdrop-blur-md"
          : "bg-black/30 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:px-10">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 p-0.5">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm group-hover:bg-black/10 transition-all duration-300"></div>
              <Image
                src="/Assets/uta_logo.png"
                alt="UTA Logo"
                width={50}
                height={50}
                className="w-full h-full object-cover rounded-md transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
              MavPads
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="relative flex-grow mx-4">
          <div className="flex-grow mx-8 max-w-xl relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-hover:text-violet-400 transition-colors duration-300"
              size={18}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                handleSearchFocus();
                if (searchQuery) setIsDropdownVisible(true);
              }}
              onBlur={() => {
                handleSearchBlur();
                setTimeout(() => setIsDropdownVisible(false), 100);
              }}
              placeholder="Search for housing..."
              className="w-full py-2 pl-10 pr-4 bg-white/5 text-white placeholder:text-white/40 border border-white/10 rounded-xl transition-all duration-300 focus:outline-none hover:bg-white/10"
            />
            {isDropdownVisible && searchResults.length > 0 && (
  <div className="absolute top-full left-0 w-full bg-black/80 backdrop-blur-lg rounded-lg mt-1 z-10 border border-white/10 shadow-lg">
    {searchResults.map((result, index) => (
      <Link key={index} href={`/housing/${result.id}`}> {/* Redirect to housing page */}
        <div className="px-4 py-3 text-white/90 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
          {result.name}
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
              className="px-4 py-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition duration-300 flex items-center gap-2"
            >
              <Home size={18} />
              <span>Home</span>
            </motion.button>
          </Link>

          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition duration-300 flex items-center gap-2"
            >
              <Users size={18} />
              <span>Contact</span>
            </motion.button>
          </Link>

          <Link href="/feedback">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition duration-300 flex items-center gap-2"
            >
              <MessageSquare size={18} />
              <span>Feedback</span>
            </motion.button>
          </Link>

          <div className="w-px h-8 bg-white/10 mx-1"></div>

          {isLoggedIn ? (
            <>
              {/* User name display - desktop */}
              <div className="px-3 py-2 text-white/90 bg-white/5 rounded-lg border border-white/10 flex items-center">
                <span className="text-violet-300 font-medium">Hello, </span>
                <span className="ml-1 font-semibold">{userName}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-lg transition duration-300 flex items-center gap-2 shadow-lg shadow-rose-600/20"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </motion.button>
            </>
          ) : (
            <>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-lg transition duration-300"
                >
                  Log In
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-lg transition duration-300 shadow-lg shadow-violet-600/20"
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: 0,
              y: -10,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            }}
            className="fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-black/90 via-violet-900/30 to-black/90 backdrop-blur-lg flex flex-col items-center justify-center gap-6 z-50"
          >
            {/* Close Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="absolute top-6 right-6 text-white w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
            >
              <X size={24} />
            </motion.button>

            <motion.div className="w-full max-w-xs flex flex-col items-center gap-4">
              {isLoggedIn && (
                <motion.div
                  custom={0}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full px-6 py-4 text-center bg-white/5 rounded-xl border border-white/10 mb-2"
                >
                  <p className="text-violet-300 text-sm">Logged in as</p>
                  <p className="text-white font-semibold text-lg">{userName}</p>
                </motion.div>
              )}

              <motion.div
                custom={isLoggedIn ? 1 : 0}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Link href="/" className="w-full">
                  <button className="w-full px-6 py-3 text-white rounded-xl flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 transition duration-300">
                    <Home size={20} />
                    <span>Home</span>
                  </button>
                </Link>
              </motion.div>

              <motion.div
                custom={isLoggedIn ? 2 : 1}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Link href="/contact" className="w-full">
                  <button className="w-full px-6 py-3 text-white rounded-xl flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 transition duration-300">
                    <Users size={20} />
                    <span>Contact</span>
                  </button>
                </Link>
              </motion.div>

              <motion.div
                custom={isLoggedIn ? 3 : 2}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Link href="/feedback" className="w-full">
                  <button className="w-full px-6 py-3 text-white rounded-xl flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 transition duration-300">
                    <MessageSquare size={20} />
                    <span>Feedback Form</span>
                  </button>
                </Link>
              </motion.div>

              <div className="w-full h-px bg-white/10 my-2"></div>

              {isLoggedIn ? (
                <motion.div
                  custom={4}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl flex items-center justify-center gap-3 transition duration-300 shadow-lg shadow-rose-500/20"
                  >
                    <LogOut size={20} />
                    <span>Log Out</span>
                  </button>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    custom={3}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                  >
                    <Link href="/login" className="w-full">
                      <button className="w-full px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition duration-300">
                        Log In
                      </button>
                    </Link>
                  </motion.div>

                  <motion.div
                    custom={4}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                  >
                    <Link href="/signup" className="w-full">
                      <button className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl transition duration-300 shadow-lg shadow-violet-500/20">
                        Sign Up
                      </button>
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Decorative Element */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.8 } }}
              className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-violet-500/10 to-transparent pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}