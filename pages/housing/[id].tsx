import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Heart, Share2, Info, ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
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
import StarRating from "../components/StarRating";
import Map from '@/components/ui/Map';


// Mock data for housing options (same as in Explore component)
const housingOptions = [
    {
        id: "1",
        name: "Arlington Hall",
        location: "600 Spaniolo Dr, Arlington, TX 76010",
        price: "$800/month",
        rating: 4.5,
        amenities: ["Wi-Fi", "Fitness Center", "Pool"],
        image: Arlinton_Hall.src,
        place: "Residence Hall",
      },
      {
        id: "2",
        name: "KC Hall",
        location: "901 S Oak St, Arlington, TX 76010",
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
        id: "4",
        name: "Vandergriff Hall",
        location: "587 Spaniolo Dr, Arlington, TX 76010",
        price: "$850/month",
        rating: 4.3,
        amenities: ["Shuttle Service", "Utilities Included", "Furnished"],
        image: Vandergriff_Hall.src,
        place: "Residence Hall",
      },
      {
        id: "5",
        name: "West Hall",
        location: "916 UTA Blvd, Arlington, TX 76013",
        price: "$700/month",
        rating: 4.1,
        amenities: ["On-Campus", "Meal Plan", "24/7 Support"],
        image: West_Hall.src,
        place: "Residence Hall",
      },
      {
        id: "6",
        name: "Arbor Oaks",
        location: "1000 - 1008 Greek Row Dr., Arlington, Texas 76013",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Arbor_Oaks.src,
        place: "Apartment",
      },
      {
        id: "7",
        name: "The Heights on Pecan",
        location: "1225 S Pecan St, Arlington, TX 76010",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Height_At_Pecan.src,
        place: "Apartment",
      },
      {
        id: "8",
        name: "The Lofts",
        location: "500 S Center St, Arlington, TX 76010",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Loft.src,
        place: "Apartment",
      },
      {
        id: "9",
        name: "Meadow Run",
        location: "501 Summit Ave, Arlington, TX 76013",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Meadow_Run.src,
        place: "Apartment",
      },
      {
        id: "10",
        name: "Timber Brook",
        location: "400 - 410 Kerby St., Arlington, Texas 76013",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Timber_Brook.src,
        place: "Apartment",
      },
      {
        id: "11",
        name: "University Village",
        location: "914 Greek Row Dr, Arlington, TX 76013",
        price: "$890/month",
        rating: 4.4,
        amenities: [
          "12-month lease term",
          "Utilities Included",
          "Open Year Round",
          "Refrigerator",
          "Unfurnished",
          "Walk-in Closets",
          "Carpeting",
          "Deadbolt Security Locks",
          "Dishwasher",
          "High-speed Internet",
          "Mini-blinds",
          "Self-cleaning Stove",
          "Unlimited Free Laundry",
          "Access to Swimming Pool"
        ],
        image: University_Village.src,
        place: "Apartment",
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 530,
        leaseLength: "12 months",
        floorPlan: "1 Bedroom / 1 Bath."
      },
      {
        id: "12",
        name: "Centennial Court (Privately Owned)",
        location: "700 W Mitchell Cir, Arlington, TX 76013",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Centinnial.src,
        place: "Apartment",
      },
  // Add other housing options here...
];

const HousingDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [housing, setHousing] = useState<typeof housingOptions[0] | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [savedListings, setSavedListings] = useState<string[]>([]);
  const { isSignedIn } = useUser();

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (id) {
      const selectedHousing = housingOptions.find(
        (option) => option.id === id
      );
      if (selectedHousing) {
        setHousing(selectedHousing);
      } else {
        router.push("/404");
      }
    }
  }, [id, router]);

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
  }, [isSignedIn]);

  // Update isFavorite state when housing or savedListings change
  useEffect(() => {
    if (housing && savedListings) {
      setIsFavorite(savedListings.includes(housing.id));
    }
  }, [housing, savedListings]);

  useEffect(() => {
    if (housing?.location) {
      const getCoordinates = async () => {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              housing.location
            )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          if (data.results?.[0]?.geometry?.location) {
            setCoordinates(data.results[0].geometry.location);
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
        }
      };
      getCoordinates();
    }
  }, [housing?.location]);

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

  const handleSaveListing = async () => {
    if (!housing) return;
    
    const isSaved = savedListings.includes(housing.id);

    try {
      if (isSignedIn) {
        // If user is signed in, try to save to server first
        const response = await fetch('/api/saved', {
          method: isSaved ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ listingId: housing.id }),
        });

        if (response.ok) {
          // Update both server and local storage on success
          if (isSaved) {
            removeListingLocally(housing.id);
            setSavedListings(prev => prev.filter(id => id !== housing.id));
          } else {
            saveListingLocally(housing.id);
            setSavedListings(prev => [...prev, housing.id]);
          }
          setIsFavorite(!isSaved);
        }
      } else {
        // For non-authenticated users, only use local storage
        if (isSaved) {
          removeListingLocally(housing.id);
          setSavedListings(prev => prev.filter(id => id !== housing.id));
        } else {
          saveListingLocally(housing.id);
          setSavedListings(prev => [...prev, housing.id]);
        }
        setIsFavorite(!isSaved);
      }
    } catch (error) {
      console.error('Error handling save:', error);
      // Fallback to local storage if server operation fails
      if (isSaved) {
        removeListingLocally(housing.id);
        setSavedListings(prev => prev.filter(id => id !== housing.id));
      } else {
        saveListingLocally(housing.id);
        setSavedListings(prev => [...prev, housing.id]);
      }
      setIsFavorite(!isSaved);
    }
  };

  if (!housing) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="relative w-full min-h-screen bg-[#111827] overflow-hidden">
      {/* Enhanced Parallax Background */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-violet-900/30 via-indigo-900/20 to-orange-900/30"
        style={{ y: backgroundY }}
      />

      {/* Enhanced Mesh Grid */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-50" />
      </div>

      {/* Enhanced Floating Orbs */}
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
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 sm:px-8 lg:px-16 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push('/components/explore')}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/70 transition-all duration-300"
          >
            <X size={24} />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Image Section - Full Width */}
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                <img
                  src={housing.image}
                  alt={housing.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSaveListing}
                    className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                      isFavorite
                        ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                        : "bg-black/50 text-white/80 hover:bg-black/70"
                    }`}
                  >
                    <Heart size={20} className={isFavorite ? "fill-white" : ""} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:bg-black/70 transition-all duration-300"
                  >
                    <Share2 size={20} />
                  </motion.button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-white mb-2"
                  >
                    {housing.name}
                  </motion.h1>
                  <div className="flex items-center text-white/70 space-x-2 mb-2">
                    <MapPin size={18} />
                    <span>{housing.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StarRating rating={housing.rating} size={20} />
                    <span className="text-white/80">{housing.rating} out of 5</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Details Section */}
            <div className="p-8 space-y-6">
              <div className="bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 rounded-xl p-4 border border-white/5">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-1">
                  {housing.price}
                </h2>
                <p className="text-white/70">Per person, per month</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {housing.amenities.map((amenity, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="text-sm bg-white/10 text-white/90 px-3 py-1 rounded-full hover:bg-white/20 transition-all duration-300"
                    >
                      {amenity}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Property Type</h3>
                <div className="flex items-center space-x-2 text-white/80 bg-white/5 p-3 rounded-lg">
                  <Info size={18} className="text-violet-400" />
                  <span>{housing.place}</span>
                </div>
              </div>

              {/* Property Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70">Bedrooms</span>
                      <span className="text-white font-medium">{housing.bedrooms}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70">Bathrooms</span>
                      <span className="text-white font-medium">{housing.bathrooms}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70">Square Feet</span>
                      <span className="text-white font-medium">{housing.squareFeet} sq. ft.</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Lease Length</span>
                      <span className="text-white font-medium">{housing.leaseLength}</span>
                    </div>
                  </div>
                  {housing.floorPlan && (
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Floor Plan</h4>
                      <p className="text-white/70">{housing.floorPlan}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      {coordinates && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Location</h2>
          <div className="rounded-2xl overflow-hidden">
            <Map center={coordinates} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HousingDetail;