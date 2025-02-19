import { motion } from "framer-motion";
import { ArrowRight, MapPin, MessageCircle, PlusCircle, Star } from "lucide-react";
import { useRouter } from "next/router"; // Use Next.js's useRouter for routing
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

// Mock data for housing options
const housingOptions = [
  { id: 1, name: "University Village", location: "Arlington, TX", price: "$800/month", rating: 4.5 },
  { id: 2, name: "The Heights on Pecan", location: "Arlington, TX", price: "$900/month", rating: 4.2 },
  { id: 3, name: "Centennial Court", location: "Arlington, TX", price: "$750/month", rating: 4.7 },
  { id: 4, name: "Maverick Place", location: "Arlington, TX", price: "$850/month", rating: 4.3 },
  { id: 5, name: "West Hall", location: "Arlington, TX", price: "$700/month", rating: 4.1 },
  { id: 6, name: "East Hall", location: "Arlington, TX", price: "$720/month", rating: 4.4 },
];

interface ReviewsModalProps {
  housingId: number;
  onClose: () => void;
}

const ReviewsModal = ({ housingId, onClose }: ReviewsModalProps) => {
  // Mock reviews data
  const reviews = [
    { id: 1, user: "John Doe", comment: "Great place to live!", rating: 4.5 },
    { id: 2, user: "Jane Smith", comment: "Very close to campus.", rating: 4.0 },
    // Add more reviews as needed
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">{review.user}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400">{review.rating}</span>
                </div>
              </div>
              <p className="text-white/60 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function Explore() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedHousingId, setSelectedHousingId] = useState<number | null>(null);
  const router = useRouter();  // Initialize the router hook

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#1A1F2C] overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/20 to-orange-900/10" />

      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <Navbar setIsMenuOpen={setIsMenuOpen} />

      {/* Main Content */}
      <div className={`relative z-10 px-6 sm:px-8 lg:px-16 pt-24 pb-16 transition-all duration-300 ${
        isMenuOpen ? "blur-lg pointer-events-none" : "blur-0"
      }`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Explore Housing Options
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Discover the perfect living space near UTA campus
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {housingOptions.map((option) => (
            <motion.div
              key={option.id}
              variants={item}
              className="group relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20 group-hover:via-black/10 group-hover:to-black/30 transition-all duration-300" />
              
              <div className="relative p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                      {option.name}
                    </h2>
                    <div className="flex items-center text-white/60 space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{option.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-orange-500/20 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 font-medium">{option.rating}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <p className="text-2xl font-bold text-orange-400">{option.price}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/housing/${option.id}`)}  // Use router.push() for navigation
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-300"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedHousingId(option.id)}  // Set the selected housing ID
                    className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors duration-300"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Reviews</span>
                  </motion.button>
                  
                  {isLoggedIn && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg transition-colors duration-300"
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
      </div>

      {/* Reviews Modal */}
      {selectedHousingId && (
        <ReviewsModal
          housingId={selectedHousingId}
          onClose={() => setSelectedHousingId(null)}
        />
      )}
    </div>
  );
}