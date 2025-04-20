import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Home, Users, MessageSquare, Bookmark, Menu, X, Search } from "lucide-react";
import { useRouter } from 'next/router';

interface NavbarProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function Navbar({ setIsMenuOpen }: NavbarProps) {
  const { isSignedIn, user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/components/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/50 backdrop-blur-xl" : "bg-black/30 backdrop-blur-md"
        }`}
      >
        <div className="max-w-8xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 lg:px-10 py-3 sm:py-4 gap-4 sm:gap-0">
          {/* Top Bar - Logo and Mobile Menu */}
          <div className="w-full sm:w-auto flex justify-between items-center">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 sm:gap-3 group">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-0.5">
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm group-hover:bg-black/10 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400">
                  MavPads
                </span>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="sm:hidden p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition duration-300 border border-white/5 hover:border-white/10"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Search Bar - Visible on all screens */}
          <form onSubmit={handleSearch} className="w-full sm:max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search housing..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-white/50" size={18} />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-3">
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
              <div className="flex items-center gap-3">
                <span className="text-white/80 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/5 text-sm">
                  Hello, {user?.firstName || "User"}
                </span>
                <div className="rounded-full overflow-hidden border border-white/5">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full transition duration-300 backdrop-blur-sm text-sm"
                  >
                    Sign In
                  </motion.button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-br from-violet-600/90 to-fuchsia-600/90 hover:from-violet-500/90 hover:to-fuchsia-500/90 text-white rounded-full transition duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg shadow-violet-600/20 text-sm"
                  >
                    Sign Up
                  </motion.button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[120px] z-40 sm:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen bg-black/95 backdrop-blur-xl px-4 py-6 flex flex-col gap-4"
            >
              <Link href="/" className="w-full">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition duration-300 flex items-center gap-3 backdrop-blur-sm border border-white/5 hover:border-white/10"
                >
                  <Home size={20} />
                  <span>Home</span>
                </motion.button>
              </Link>

              <Link href="/contact" className="w-full">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition duration-300 flex items-center gap-3 backdrop-blur-sm border border-white/5 hover:border-white/10"
                >
                  <Users size={20} />
                  <span>Contact</span>
                </motion.button>
              </Link>

              <Link href="/feedback" className="w-full">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition duration-300 flex items-center gap-3 backdrop-blur-sm border border-white/5 hover:border-white/10"
                >
                  <MessageSquare size={20} />
                  <span>Feedback</span>
                </motion.button>
              </Link>

              <Link href="/saved" className="w-full">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition duration-300 flex items-center gap-3 backdrop-blur-sm border border-white/5 hover:border-white/10"
                >
                  <Bookmark size={20} />
                  <span>Saved</span>
                </motion.button>
              </Link>

              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

              {isSignedIn ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
                    <span className="text-white/80">Hello, {user?.firstName || "User"}</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/5">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <SignInButton mode="modal">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition duration-300 backdrop-blur-sm"
                    >
                      Sign In
                    </motion.button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-gradient-to-br from-violet-600/90 to-fuchsia-600/90 hover:from-violet-500/90 hover:to-fuchsia-500/90 text-white rounded-xl transition duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg shadow-violet-600/20"
                    >
                      Sign Up
                    </motion.button>
                  </SignUpButton>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
