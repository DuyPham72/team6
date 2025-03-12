import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import {housingOptions, HousingOption} from "./explore";

export default function Navbar({ setIsMenuOpen }: { setIsMenuOpen: (isOpen: boolean) => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HousingOption[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
    setIsMenuOpen(!isMenuOpen); // Notify Home.tsx to apply the blur effect
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if(query.length > 2) {
      const results = housingOptions.filter((housing) =>
        housing.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsDropdownVisible(true);  
    }else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };  

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-sm z-50">
      <div className="flex justify-between items-center px-6 py-4 md:px-10">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <Image src="/Assets/uta_logo.png" alt="UTA Logo" width={50} height={50} />
            <span>UTA Housing</span>
          </div>
        </a>

        {/* Search Bar */}
        <div className="relative flex-grow mx-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={() => setTimeout(() => setIsDropdownVisible(false), 100)}
            onFocus={() => searchQuery && setIsDropdownVisible(true)}
            placeholder="Search for housing..."
            className="w-full py-2 rounded bg-white text-black pl-2"
          />
          {isDropdownVisible && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded mt-1 z-10">
              {searchResults.map((result, index) => (
                <div key={index} className="px-4 py-5 hover:bg-gray-200 cursor-pointer">
                  {result.name}
                </div>
              ))}
            </div>  
          )}    
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          <Link href="/">
            <button className="px-4 py-2 text-white rounded hover:bg-white/20 transition duration-300">
              Home
            </button>
          </Link>
          <Link href="/contact">
            <button className="px-4 py-2 text-white rounded hover:bg-white/20 transition duration-300">
              Contact
            </button>
          </Link>
          <Link href="/feedback">
            <button className="px-4 py-2 text-white rounded hover:bg-white/20 transition duration-300">
              Feedback Form
            </button>
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            >
              Log Out
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-white text-2xl">
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black/50 backdrop-blur-md flex flex-col items-center justify-center gap-6">
          {/* Close Menu Button */}
          <button
            onClick={toggleMenu}
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition duration-300"
          >
            <FiX />
          </button>

          <Link href="/">
            <button className="px-4 py-2 text-white rounded hover:bg-white/20 transition duration-300 w-3/4 text-center">
              Home
            </button>
          </Link>
          <Link href="/contact">
            <button className="px-4 py-2 text-white rounded hover:bg-white/20 transition duration-300 w-3/4 text-center">
              Contact
            </button>
          </Link>
          <Link href="/feedback">
            <button className="px-4 py-2 text-white rounded hover:bg-white/20 transition duration-300 w-3/4 text-center">
              Feedback Form
            </button>
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 w-3/4 text-center"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link href="/login" className="w-3/4 text-center">
                <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition duration-300 w-full">
                  Log In
                </button>
              </Link>
              <Link href="/signup" className="w-3/4 text-center">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 w-full">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
 