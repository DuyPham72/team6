import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Phone, Info, Share2, Heart } from "lucide-react";
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
import StarRating from "../components/StarRating";


// Mock data for housing options (same as in Explore component)
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
  // Add other housing options here...
];

const HousingDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [housing, setHousing] = useState<typeof housingOptions[0] | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    if (id) {
      const selectedHousing = housingOptions.find(
        (option) => option.id === parseInt(id as string)
      );
      if (selectedHousing) {
        setHousing(selectedHousing);
      } else {
        router.push("/404");
      }
    }
  }, [id, router]);

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Section */}
              <div className="relative group overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-[4/3]"
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
                      onClick={() => setIsFavorite(!isFavorite)}
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
                </motion.div>
              </div>

              {/* Details Section */}
              <div className="p-8 space-y-6">
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-white mb-4"
                  >
                    {housing.name}
                  </motion.h1>
                  <div className="flex items-center text-white/70 space-x-2 mb-4">
                    <MapPin size={18} />
                    <span>{housing.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-6">
                    <StarRating rating={housing.rating} size={20} />
                    <span className="text-white/80">{housing.rating} out of 5</span>
                  </div>
                </div>

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

                <div className="flex flex-col space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full px-4 py-3 bg-gradient-to-br from-violet-600/90 to-fuchsia-600/90 hover:from-violet-500/90 hover:to-fuchsia-500/90 text-white rounded-full transition-all duration-300 shadow-lg shadow-violet-600/20 font-medium backdrop-blur-sm border border-white/10 hover:border-white/20"
                  >
                    Apply Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
                  >
                    <Phone size={18} />
                    <span>Schedule a Tour</span>
                  </motion.button>
                </div>

                <div className="p-4 rounded-xl bg-indigo-900/30 border border-indigo-500/30">
                  <p className="text-white/80 text-sm">
                    Mention that you found this listing on UTA Housing when contacting for a special discount!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HousingDetail;