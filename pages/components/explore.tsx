import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Filter,
  Heart,
  MapPin,
  MessageCircle,
  PlusCircle,
  Search,
  BedDouble,
  Bath,
  Ruler,
  Calendar
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../../Misc/ui/ToastContext";
import { getLocalSavedListings, saveListingLocally, removeListingLocally } from "../../lib/utils/localStorage";
import Arbor_Oaks from "../../public/Assets/Arbor_Oaks.jpg";
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
import Loader from "../../components/ui/Loader";

export interface HousingOption {
  id: string;
  name: string;
  location: string;
  price: string;
  rating?: number;
  amenities: string[];
  image: string;
  place: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  leaseLength: string;
}

// Mock data for housing options
export const housingOptions = [
  {
    id: "1",
    name: "Arlington Hall",
    location: "Arlington, TX",
    price: "$800/month",
    amenities: ["Wi-Fi", "Fitness Center", "Pool"],
    image: Arlinton_Hall.src,
    place: "Residence Hall",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    leaseLength: "12 months",
  },
  {
    id: "2",
    name: "KC Hall",
    location: "Arlington, TX",
    price: "$900/month",
    amenities: ["Parking", "Study Rooms", "Laundry"],
    image: KC_Hall.src,
    place: "Residence Hall",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    leaseLength: "12 months",
  },
  {
    id: "4",
    name: "Vandergriff Hall",
    location: "Arlington, TX",
    price: "$850/month",
    amenities: ["Shuttle Service", "Utilities Included", "Furnished"],
    image: Vandergriff_Hall.src,
    place: "Residence Hall",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2000,
    leaseLength: "12 months",
  },
  {
    id: "5",
    name: "West Hall",
    location: "Arlington, TX",
    price: "$700/month",
    amenities: ["On-Campus", "Meal Plan", "24/7 Support"],
    image: West_Hall.src,
    place: "Residence Hall",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 800,
    leaseLength: "12 months",
  },
  {
    id: "6",
    name: "Arbor Oaks",
    location: "Arlington, TX",
    price: "$720/month",
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Arbor_Oaks.src,
    place: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1000,
    leaseLength: "12 months",
  },
  {
    id: "7",
    name: "The Heights on Pecan",
    location: "Arlington, TX",
    price: "$720/month",
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Height_At_Pecan.src,
    place: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    leaseLength: "12 months",
  },
  {
    id: "8",
    name: "The Lofts",
    location: "Arlington, TX",
    price: "$720/month",
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Loft.src,
    place: "Apartment",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2000,
    leaseLength: "12 months",
  },
  {
    id: "9",
    name: "Meadow Run",
    location: "Arlington, TX",
    price: "$720/month",
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Meadow_Run.src,
    place: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    leaseLength: "12 months",
  },
  {
    id: "10",
    name: "Timber Brook",
    location: "Arlington, TX",
    price: "$720/month",
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Timber_Brook.src,
    place: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    leaseLength: "12 months",
  },
  {
    id: "11",
    name: "University Village",
    location: "Arlington, TX",
    price: "$720/month",
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: University_Village.src,
    place: "Apartment",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2000,
    leaseLength: "12 months",
  },
  {
    id: "12",
    name: "Centennial Court (Privately Owned)",
    location: "Arlington, TX",
    price: "$720/month",
    amenities: ["Study Lounge", "Community Events", "AC"],
    image: Centinnial.src,
    place: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1000,
    leaseLength: "12 months",
  },
];

export default function Explore() {
  const { isSignedIn, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [placeFilter, setPlaceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("rating");
  const [viewMode, setViewMode] = useState("grid");
  const [filteredOptions, setFilteredOptions] = useState<HousingOption[]>([]);
  const [savedListings, setSavedListings] = useState<string[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedHousing, setSelectedHousing] = useState<HousingOption | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [housingRatings, setHousingRatings] = useState<Record<string, number>>({});
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const handleViewDetails = (id: string) => {
    router.push(`/housing/${id}`);
  };

  // Read URL query parameters
  useEffect(() => {
    const { maxPrice, placeType } = router.query;
    console.log('URL Query Parameters:', { maxPrice, placeType });
    if (maxPrice && typeof maxPrice === 'string') {
      setPriceFilter(maxPrice);
    }
    if (placeType && typeof placeType === 'string') {
      setPlaceFilter(placeType);
    }
  }, [router.query]);

  useEffect(() => {
    // Apply animations when component mounts
    const timeline = setTimeout(() => {
      setSelectedHousing(null);
    }, 1500);

    return () => clearTimeout(timeline);
  }, []);

  useEffect(() => {
    let filtered = housingOptions;
    console.log('Initial filters:', { priceFilter, placeFilter });

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
      console.log('Applying price filter:', maxPrice);
      filtered = filtered.filter((option) => {
        const price = parseInt(option.price.replace(/\D/g, ""));
        console.log('Comparing prices:', { optionPrice: price, maxPrice });
        return price <= maxPrice;
      });
    }

    // Apply place filter
    if (placeFilter) {
      console.log('Applying place filter:', placeFilter);
      filtered = filtered.filter((option) => {
        console.log('Comparing places:', { optionPlace: option.place, filterPlace: placeFilter });
        return option.place === placeFilter;
      });
    }

    console.log('Filtered results:', filtered);
    setFilteredOptions(filtered);
  }, [searchQuery, priceFilter, placeFilter, sortOrder]);

  // Initialize saved listings from local storage
  useEffect(() => {
    const localSavedListings = getLocalSavedListings();
    setSavedListings(localSavedListings);
    
    // If user is signed in, also fetch from server
    if (isSignedIn) {
      fetchSavedListings().then((serverListings: string[] | null) => {
        if (serverListings && serverListings.length > 0) {
          const mergedListings = Array.from(new Set([...localSavedListings, ...serverListings]));
          setSavedListings(mergedListings);
        }
      });
    }
    
    // Fetch ratings for all housing options
    fetchAllHousingRatings();
  }, [isSignedIn]);

  // Function to fetch ratings for all housing options
  const fetchAllHousingRatings = async () => {
    try {
      setLoading(true);
      const ratings: Record<string, number> = {};
      
      // Fetch all reviews at once instead of making multiple requests
      const response = await fetch('/api/getReviews');
      
      if (response.ok) {
        const data = await response.json();
        const reviews = data.reviews || [];
        
        // Group reviews by housingId and calculate average rating
        const reviewsByHousing: Record<string, { total: number, count: number }> = {};
        
        reviews.forEach((review: { housingId: string, rating: number }) => {
          if (!reviewsByHousing[review.housingId]) {
            reviewsByHousing[review.housingId] = { total: 0, count: 0 };
          }
          reviewsByHousing[review.housingId].total += review.rating;
          reviewsByHousing[review.housingId].count += 1;
        });
        
        // Calculate average ratings
        Object.keys(reviewsByHousing).forEach(housingId => {
          const { total, count } = reviewsByHousing[housingId];
          ratings[housingId] = total / count;
        });
      }
      
      setHousingRatings(ratings);
    } catch (error) {
      console.error('Error fetching housing ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to update rating for a specific housing option
  const updateHousingRating = async (housingId: string) => {
    try {
      const response = await fetch(`/api/getReviews?housingId=${housingId}`);
      if (response.ok) {
        const data = await response.json();
        const reviews = data.reviews || [];
        
        // Calculate average rating
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
          const newRating = totalRating / reviews.length;
          
          // Update the rating in state
          setHousingRatings(prev => ({
            ...prev,
            [housingId]: newRating
          }));
          
          // Update the rating in the housing options
          setFilteredOptions(prev => 
            prev.map(option => 
              option.id === housingId 
                ? { ...option, rating: newRating } 
                : option
            )
          );
        }
      }
    } catch (error) {
      console.error(`Error updating rating for ${housingId}:`, error);
    }
  };

  // Handle closing the reviews modal
  const handleCloseReviewsModal = () => {
    setShowReviewsModal(false);
    // Update the rating when the modal is closed
    if (selectedHousing) {
      updateHousingRating(selectedHousing.id);
    }
  };

  // Handle closing the review form
  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setSelectedHousing(null);
  };

  const fetchSavedListings = async () => {
    try {
      const response = await fetch('/api/saved');
      if (response.ok) {
        const data = await response.json();
        return data.map((item: { listingId: string }) => item.listingId);
      }
    } catch (error) {
      console.error('Error fetching saved listings:', error);
    }
    return null;
  };

  const handleSaveListing = async (listingId: string) => {
    const isSaved = savedListings.includes(listingId);

    try {
      if (isSignedIn) {
        // If user is signed in, try to save to server first
        const response = await fetch('/api/saved', {
          method: isSaved ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ listingId }),
        });

        if (response.ok) {
          // Update both server and local storage on success
          if (isSaved) {
            removeListingLocally(listingId);
            setSavedListings(prev => prev.filter(id => id !== listingId));
            showToast('Listing removed from saved', 'success');
          } else {
            saveListingLocally(listingId);
            setSavedListings(prev => [...prev, listingId]);
            showToast('Listing saved successfully', 'success');
          }
        }
      } else {
        // For non-authenticated users, only use local storage
        if (isSaved) {
          removeListingLocally(listingId);
          setSavedListings(prev => prev.filter(id => id !== listingId));
          showToast('Listing removed from saved', 'success');
        } else {
          saveListingLocally(listingId);
          setSavedListings(prev => [...prev, listingId]);
          showToast('Listing saved', 'success');
        }
      }
    } catch (error) {
      console.error('Error handling save:', error);
      // Fallback to local storage if server operation fails
      if (isSaved) {
        removeListingLocally(listingId);
        setSavedListings(prev => prev.filter(id => id !== listingId));
        showToast('Listing removed from saved', 'success');
      } else {
        saveListingLocally(listingId);
        setSavedListings(prev => [...prev, listingId]);
        showToast('Listing saved locally', 'success');
      }
    }
  };

  // Function to refresh reviews for a specific housing
  const refreshReviews = async (housingId: string) => {
    try {
      const response = await fetch(`/api/getReviews?housingId=${housingId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      
      const data = await response.json();
      const reviews = data.reviews || [];
      
      // Calculate average rating
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        // Update the housing ratings state
        setHousingRatings(prev => ({
          ...prev,
          [housingId]: averageRating
        }));
      }
    } catch (error) {
      console.error("Error refreshing reviews:", error);
    }
  };

  // Handle opening the review form
  const handleOpenReviewForm = (housing: HousingOption) => {
    setSelectedHousing(housing);
    setShowReviewForm(true);
  };

  // Handle review submission
  const handleReviewSubmitted = () => {
    if (selectedHousing?.id) {
      updateHousingRating(selectedHousing.id);
    }
  };

  // Handle reviews refreshed
  const handleReviewsRefreshed = (housingId: string, averageRating: number) => {
    setHousingRatings(prev => ({
      ...prev,
      [housingId]: averageRating
    }));
  };

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

  const handleCardHover = (id: string) => {
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
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <Loader />
                </div>
              ) : (
                filteredOptions.map((option) => (
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
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {housingRatings[option.id] !== undefined ? (
                          <div className="bg-black/60 backdrop-blur-md py-1 px-2 rounded-lg flex items-center gap-1">
                            <StarRating rating={housingRatings[option.id] || 0} size={16} />
                          </div>
                        ) : (
                          <div className="bg-black/60 backdrop-blur-md py-1 px-2 rounded-lg text-white/60 text-sm">
                            No reviews
                          </div>
                        )}
                        <button
                          onClick={() => handleSaveListing(option.id)}
                          className="p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-colors duration-300"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              savedListings.includes(option.id)
                                ? "text-violet-400 fill-current"
                                : "text-white/80"
                            }`}
                          />
                        </button>
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
                      <div className="flex flex-wrap gap-3 mt-4">
                        {option.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium text-white/80 bg-white/10 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-6 mb-6">
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
                          onClick={() => {
                            setSelectedHousing(housingOptions.find(h => h.id === option.id) || null);
                            setShowReviewsModal(true);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl transition-colors duration-300"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Reviews</span>
                        </motion.button>

                        {isSignedIn && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedHousing(housingOptions.find(h => h.id === option.id) || null);
                              setShowReviewForm(true);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-colors duration-300 shadow-lg shadow-emerald-600/20"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>Add Review</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
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
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader />
                </div>
              ) : (
                filteredOptions.map((option) => (
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
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {housingRatings[option.id] !== undefined ? (
                          <div className="bg-black/60 backdrop-blur-md py-1 px-2 rounded-lg flex items-center gap-1">
                            <StarRating rating={housingRatings[option.id] || 0} size={16} />
                          </div>
                        ) : (
                          <div className="bg-black/60 backdrop-blur-md py-1 px-2 rounded-lg text-white/60 text-sm">
                            No reviews
                          </div>
                        )}
                        <button
                          onClick={() => handleSaveListing(option.id)}
                          className="p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-colors duration-300"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              savedListings.includes(option.id)
                                ? "text-violet-400 fill-current"
                                : "text-white/80"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="relative p-6 flex-grow">
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
                        <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                          {option.price}
                        </p>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        {option.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium text-white/80 bg-white/10 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-6 mb-6">
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
                          onClick={() => {
                            setSelectedHousing(housingOptions.find(h => h.id === option.id) || null);
                            setShowReviewsModal(true);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl transition-colors duration-300"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Reviews</span>
                        </motion.button>

                        {isSignedIn && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedHousing(housingOptions.find(h => h.id === option.id) || null);
                              setShowReviewForm(true);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-colors duration-300 shadow-lg shadow-emerald-600/20"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>Add Review</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
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
          {showReviewsModal && selectedHousing && (
            <ReviewsModal
              housingId={selectedHousing.id}
              apartmentName={selectedHousing.name}
              onClose={handleCloseReviewsModal}
              onReviewSubmitted={handleReviewSubmitted}
              onReviewsRefreshed={(averageRating) => handleReviewsRefreshed(selectedHousing.id, averageRating)}
            />
          )}
        </AnimatePresence>

        {/* Review Form Modal */}
        <AnimatePresence>
          {showReviewForm && selectedHousing && (
            <ReviewForm
              housingId={selectedHousing.id}
              apartmentName={selectedHousing.name}
              onClose={handleCloseReviewForm}
              onReviewSubmitted={handleReviewSubmitted}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

