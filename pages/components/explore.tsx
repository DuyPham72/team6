import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Filter,
  MapPin,
  MessageCircle,
  PlusCircle,
  Search,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Arbor_Oaks from "../../public/Assets/Arbor_Oaks.jpeg";
import Arlinton_Hall from "../../public/Assets/Arlington_Hall.png";
import Centinnial from "../../public/Assets/Centennial.jpg";
import Height_At_Pecan from "../../public/Assets/Height_At_Pecan.png";
import KC_Hall from "../../public/Assets/KC_Hall.png";
import Loft from "../../public/Assets/Loft.png";
import Meadow_Run from "../../public/Assets/Medow_Run.png";
import Timber_Brook from "../../public/Assets/Timber_Brook.png";
import University_Village from "../../public/Assets/University_Village.png";
import Vandergriff_Hall from "../../public/Assets/Vandergriff_Hall.png";
import West_Hall from "../../public/Assets/West_Hall.png";
import ReviewForm from "../components/ReviewForm";
import ReviewsModal from "../components/ReviewsModal";
import StarRating from "../components/StarRating";
import Navbar from "./Navbar";



// Mock data for housing options
const housingOptions = [
  {
    id: 1,
    name: "Arlington Hall",
    location: "Arlington, TX",
    price: "$800/month",
    rating: 4.5,
    amenities: ["Wi-Fi", "Fitness Center", "Pool"],
    image: Arlinton_Hall.src,
    place: "Residence Hall",
  },
  {
    id: 2,
    name: "KC Hall",
    location: "Arlington, TX",
    price: "$900/month",
    rating: 4.2,
    amenities: ["Parking", "Study Rooms", "Laundry"],
    image: KC_Hall.src,
    place: "Residence Hall",
  },
  // {
  //   id: 3,
  //   name: "Maverick Hall",
  //   location: "Arlington, TX",
  //   price: "$750/month",
  //   rating: 4.7,
  //   amenities: ["Security", "Game Room", "Pet Friendly"],
  //   image: "/api/placeholder/400/250",
  //   place: "Residence Hall",
  // },
  {
    id: 4,
    name: "Vandergriff Hall",
    location: "Arlington, TX",
    price: "$850/month",
    rating: 4.3,
    amenities: ["Shuttle Service", "Utilities Included", "Furnished"],
    image: Vandergriff_Hall.src,
    place: "Residence Hall",
  },
  {
    id: 5,
    name: "West Hall",
    location: "Arlington, TX",
    price: "$700/month",
    rating: 4.1,
    amenities: ["On-Campus", "Meal Plan", "24/7 Support"],
    image: West_Hall.src,
    place: "Residence Hall",
  },
  {
    id: 6,
    name: "Arbor Oaks",
    location: "Arlington, TX",
    price: "$720/month",
    rating: 4.4,
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Arbor_Oaks.src,
    place: "Apartment",
  },
  {
    id: 7,
    name: "The Heights on Pecan",
    location: "Arlington, TX",
    price: "$720/month",
    rating: 4.4,
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Height_At_Pecan.src,
    place: "Apartment",
  },
  {
    id: 8,
    name: "The Lofts",
    location: "Arlington, TX",
    price: "$720/month",
    rating: 4.4,
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Loft.src,
    place: "Apartment",
  },
  {
    id: 9,
    name: "Meadow Run",
    location: "Arlington, TX",
    price: "$720/month",
    rating: 4.4,
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Meadow_Run.src,
    place: "Apartment",
  },
  {
    id: 10,
    name: "Timber Brook",
    location: "Arlington, TX",
    price: "$720/month",
    rating: 4.4,
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Timber_Brook.src,
    place: "Apartment",
  },
  {
    id: 11,
    name: "University Village",
    location: "Arlington, TX",
    price: "$720/month",
    rating: 4.4,
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: University_Village.src,
    place: "Apartment",
  },
  {
    id: 12,
    name: "Centennial Court (Privately Owned)",
    location: "Arlington, TX",
    price: "$720/month",
    rating: 4.4,
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Centinnial.src,
    place: "Apartment",
  },
];

export default function Explore() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedHousingId, setSelectedHousingId] = useState<number | null>(null);
  const [reviewFormHousingId, setReviewFormHousingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [placeFilter, setPlaceFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(housingOptions);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState("rating");
  const [viewMode, setViewMode] = useState("grid");

  const router = useRouter();
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const handleViewDetails = (id: number): void => {
    router.push(`/housing/${id}`);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }

    // Apply animations when component mounts
    const timeline = setTimeout(() => {
      setActiveCardId(null);
    }, 1500);

    return () => clearTimeout(timeline);
  }, []);

  useEffect(() => {
    let filtered = housingOptions;

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (option) =>
          option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filter
    if (priceFilter) {
      const maxPrice = parseInt(priceFilter.replace(/\D/g, ""));
      filtered = filtered.filter((option) => {
        const price = parseInt(option.price.replace(/\D/g, ""));
        return price <= maxPrice;
      });
    }

    // Apply place filter
    if (placeFilter) {
      filtered = filtered.filter((option) => option.place === placeFilter);
    }

    // Apply sorting
    if (sortOrder === "price-low") {
      filtered = [...filtered].sort((a, b) => {
        return parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, ""));
      });
    } else if (sortOrder === "price-high") {
      filtered = [...filtered].sort((a, b) => {
        return parseInt(b.price.replace(/\D/g, "")) - parseInt(a.price.replace(/\D/g, ""));
      });
    } else if (sortOrder === "rating") {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }

    setFilteredOptions(filtered);
  }, [searchQuery, priceFilter, placeFilter, sortOrder]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const filterVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  interface HousingOption {
    id: number;
    name: string;
    location: string;
    price: string;
    rating: number;
    amenities: string[];
    image: string;
  }


  interface HandleCardHover {
    (id: number): void;
  }

  const handleCardHover: HandleCardHover = (id) => {
    setActiveCardId(id);
  };

  return (
    <>
      <Navbar setIsMenuOpen={setIsMenuOpen} />
      <div ref={scrollRef} className="relative w-full min-h-screen bg-[#111827] overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-violet-900/30 via-indigo-900/20 to-orange-900/30"
          style={{ y: backgroundY }}
        />

        {/* Animated Mesh Grid */}
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-50" />
        </div>

        {/* Floating Orbs (Decorative Elements) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 10, 0, -10, 0],
              y: [0, -10, 0, 10, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-xl"
          />
          <motion.div
            animate={{
              x: [0, -15, 0, 15, 0],
              y: [0, 15, 0, -15, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/3 left-1/3 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-xl"
          />
          <motion.div
            animate={{
              x: [0, 20, 0, -20, 0],
              y: [0, -20, 0, 20, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-2/3 right-1/3 w-36 h-36 rounded-full bg-gradient-to-br from-orange-500/10 to-yellow-500/10 blur-xl"
          />
        </div>

        {/* Main Content */}
        <div
          className={`relative z-10 px-6 sm:px-8 lg:px-16 pt-24 pb-16 transition-all duration-300 ${
            isMenuOpen ? "blur-lg pointer-events-none" : "blur-0"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-12 relative"
          >
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-violet-600/20 to-fuchsia-500/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400">
                Explore Housing
              </span>
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              Discover the perfect living space near UTA campus
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-5xl mx-auto mb-12"
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 text-white/50" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or location..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex flex-col xs:flex-row gap-3">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white transition-all"
                  >
                    <Filter size={18} />
                    <span>Filters</span>
                    {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode("grid")}
                      className={`flex-1 rounded-xl px-4 py-2 transition-all ${
                        viewMode === "grid"
                          ? "bg-violet-600 text-white"
                          : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      Grid
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode("list")}
                      className={`flex-1 rounded-xl px-4 py-2 transition-all ${
                        viewMode === "list"
                          ? "bg-violet-600 text-white"
                          : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      List
                    </motion.button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={filterVariants}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10">
                      <div>
                        <label className="block text-white/70 mb-2">Price Range</label>
                        <select
                          value={priceFilter}
                          onChange={(e) => setPriceFilter(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        >
                          <option className="bg-violet-500 text-white font-medium" value="">
                            Any Price
                          </option>
                          <option className="bg-violet-500 text-white font-medium" value="700">
                            Up to $700
                          </option>
                          <option className="bg-violet-500 text-white font-medium" value="800">
                            Up to $800
                          </option>
                          <option className="bg-violet-500 text-white font-medium" value="900">
                            Up to $900
                          </option>
                          <option className="bg-violet-500 text-white font-medium" value="1000">
                            Up to $1000
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white/70 mb-2">Place Type</label>
                        <select
                          value={placeFilter}
                          onChange={(e) => setPlaceFilter(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        >
                          <option className="bg-violet-500 text-white font-medium" value="">
                            Any Type
                          </option>
                          <option className="bg-violet-500 text-white font-medium" value="Residence Hall">
                            Residence Hall
                          </option>
                          <option className="bg-violet-500 text-white font-medium" value="Apartment">
                            Apartment
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white/70 mb-2">Sort By</label>
                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        >
                          <option className="bg-violet-500 text-white font-medium" value="rating">
                            Highest Rating
                          </option>
                          <option className="bg-violet-500 text-white font-medium" value="price-low">
                            Price: Low to High
                          </option>
                          <option className="bg-violet-500 text-white font-medium" value="price-high">
                            Price: High to Low
                          </option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Results Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-6xl mx-auto mb-6 px-2"
          >
            <p className="text-white/60">
              Showing {filteredOptions.length} housing options
            </p>
          </motion.div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredOptions.map((option) => (
                <motion.div
                  key={option.id}
                  variants={item}
                  onHoverStart={() => handleCardHover(option.id)}
                  onHoverEnd={() => setActiveCardId(null)}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${
                    activeCardId === option.id
                      ? "ring-2 ring-violet-500 shadow-lg shadow-violet-500/20"
                      : "bg-white/5 backdrop-blur-md border border-white/10 hover:border-violet-500/50"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={option.image}
                      alt={option.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md py-1 px-2 rounded-lg">
                      <StarRating rating={option.rating} size={16} />
                    </div>
                  </div>

                  <div className="relative p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors duration-300">
                          {option.name}
                        </h2>
                        <div className="flex items-center text-white/60 space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{option.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {option.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        {option.price}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(option.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl transition-all duration-300 shadow-lg shadow-violet-600/20"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedHousingId(option.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl transition-colors duration-300"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Reviews</span>
                      </motion.button>

                      {isLoggedIn && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setReviewFormHousingId(option.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-colors duration-300 shadow-lg shadow-emerald-600/20"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Add Review</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-5xl mx-auto space-y-4"
            >
              {filteredOptions.map((option) => (
                <motion.div
                  key={option.id}
                  variants={item}
                  onHoverStart={() => handleCardHover(option.id)}
                  onHoverEnd={() => setActiveCardId(null)}
                  whileHover={{
                    x: 5,
                    transition: { duration: 0.2 },
                  }}
                  className={`relative flex flex-col md:flex-row rounded-2xl overflow-hidden transition-all duration-300 ${
                    activeCardId === option.id
                      ? "ring-2 ring-violet-500 shadow-lg shadow-violet-500/20"
                      : "bg-white/5 backdrop-blur-md border border-white/10 hover:border-violet-500/50"
                  }`}
                >
                  {/* Image */}
                  <div className="relative w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
                    <img
                      src={option.image}
                      alt={option.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:bg-gradient-to-r" />
                  </div>

                  <div className="relative p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors duration-300">
                          {option.name}
                        </h2>
                        <div className="flex items-center text-white/60 space-x-2 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{option.location}</span>
                        </div>
                        <div className="flex items-center mb-4">
                          <div className="bg-black/60 backdrop-blur-md py-1 px-2 rounded-lg">
                            <StarRating rating={option.rating} size={16} />
                          </div>
                        </div>
                      </div>
                      <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        {option.price}
                      </p>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {option.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-auto">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(option.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl transition-all duration-300 shadow-lg shadow-violet-600/20"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedHousingId(option.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl transition-colors duration-300"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Reviews</span>
                      </motion.button>

                      {isLoggedIn && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setReviewFormHousingId(option.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-colors duration-300 shadow-lg shadow-emerald-600/20"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Add Review</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No Results State */}
          {filteredOptions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto text-center mt-12 p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
            >
              <div className="mb-4 text-white/60">
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPriceFilter("");
                  setPlaceFilter("");
                }}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>

        {/* Reviews Modal */}
        <AnimatePresence>
          {selectedHousingId && (
            <ReviewsModal
              housingId={selectedHousingId}
              apartmentName={housingOptions.find((h) => h.id === selectedHousingId)?.name || ""}
              onClose={() => setSelectedHousingId(null)}
            />
          )}
        </AnimatePresence>

        {/* Review Form Modal */}
        <AnimatePresence>
          {reviewFormHousingId && (
            <ReviewForm
              housingId={reviewFormHousingId}
              apartmentName={
                housingOptions.find((h) => h.id === reviewFormHousingId)?.name || ""
              }
              onClose={() => setReviewFormHousingId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}