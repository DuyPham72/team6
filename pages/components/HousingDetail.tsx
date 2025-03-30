import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Heart,
  Info,
  MapPin,
  MessageCircle,
  Phone,
  PlusCircle,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";
import ReviewsModal from "../components/ReviewsModal";
import StarRating from "../components/StarRating";
import Navbar from "./Navbar";

// Mock data for housing options
const housingOptions = [
  {
    id: 1,
    name: "University Village",
    location: "Arlington, TX",
    address: "1001 University Dr, Arlington, TX 76013",
    price: "$800/month",
    rating: 4.5,
    amenities: ["Wi-Fi", "Fitness Center", "Pool"],
    features: [
      "Furnished",
      "Individual Leases",
      "Roommate Matching",
      "Study Rooms",
      "24-Hour Maintenance",
    ],
    description:
      "University Village offers comfortable student housing close to UTA campus. Our fully-furnished apartments include private and shared options with all utilities included and high-speed internet. Enjoy our fitness center, swimming pool, and community events.",
    contactPhone: "(817) 555-1234",
    contactEmail: "info@universityvillage.com",
    squareFeet: "850 sq ft",
    bedrooms: "2-4",
    bathrooms: "2",
    distanceToCampus: "0.3 miles",
    leaseTerms: "12 months, 9 months (academic year)",
    availabilityDate: "August 1, 2025",
    petPolicy: "Small pets allowed with deposit",
    securityDeposit: "$500",
    applicationFee: "$50",
    images: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
    ],
    image: "/api/placeholder/400/250",
  },
  // Add other housing options here...
];

export default function HousingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useHistory();
  const housingId = parseInt(id || "0");
  const housing = housingOptions.find((h) => h.id === housingId);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }

    // Redirect if housing option is not found
    if (!housing) {
      navigate.push("/explore");
    }

    window.scrollTo(0, 0);
  }, [housing, navigate]);

  if (!housing) {
    return null;
  }

  return (
    <>
      <Navbar setIsMenuOpen={setIsMenuOpen} />
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
        <div className={`relative z-10 px-6 sm:px-8 lg:px-16 pt-24 pb-16 transition-all duration-300 ${
          isMenuOpen ? "blur-lg pointer-events-none" : "blur-0"
        }`}>
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate.push("/explore")}
              className="flex items-center space-x-2 px-4 py-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/5 hover:border-white/10"
            >
              <ArrowLeft size={20} />
              <span>Back to Explore</span>
            </motion.button>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Images and Key Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Main Image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-2 group"
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl">
                    <img
                      src={housing.images[selectedImageIndex]}
                      alt={housing.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                  </div>
                </motion.div>

                {/* Thumbnails */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                  className="grid grid-cols-4 gap-2"
                >
                  {housing.images.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-video cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImageIndex === index
                          ? "border-violet-500 scale-105 shadow-lg shadow-violet-500/20"
                          : "border-transparent hover:border-white/30"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${housing.name} - View ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <h2 className="text-xl font-bold text-white mb-4">About {housing.name}</h2>
                  <p className="text-white/80 leading-relaxed mb-6">{housing.description}</p>

                  {/* Features */}
                  <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {housing.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-white/80 bg-white/5 p-2 rounded-lg">
                        <Check size={16} className="text-emerald-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  <h3 className="text-lg font-semibold text-white mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {housing.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="text-sm bg-white/10 text-white/90 px-3 py-1 rounded-full hover:bg-white/20 transition-all duration-300"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Reviews */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">Reviews</h2>
                      <div className="flex items-center space-x-3">
                        <StarRating rating={housing.rating} size={20} />
                        <span className="text-white/80">{housing.rating} out of 5</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsReviewsModalOpen(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
                    >
                      <MessageCircle size={18} />
                      <span>Read All Reviews</span>
                    </motion.button>
                  </div>

                  {isLoggedIn && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsReviewFormOpen(true)}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-br from-emerald-600/90 to-teal-600/90 hover:from-emerald-500/90 hover:to-teal-500/90 text-white rounded-full transition-all duration-300 shadow-lg shadow-emerald-600/20 backdrop-blur-sm border border-white/10 hover:border-white/20"
                    >
                      <PlusCircle size={18} />
                      <span>Write a Review</span>
                    </motion.button>
                  )}
                </motion.div>
              </div>

              {/* Right Column - Details and Contact */}
              <div className="space-y-6">
                {/* Housing Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <h1 className="text-3xl font-bold text-white mb-3">{housing.name}</h1>
                  <div className="flex items-center text-white/70 space-x-2 mb-4">
                    <MapPin size={18} />
                    <span>{housing.address}</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-6">
                    <StarRating rating={housing.rating} size={16} />
                    <span className="text-white/80 text-sm">{housing.rating} out of 5</span>
                  </div>
                  <div className="bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 rounded-xl p-4 mb-4 border border-white/5">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-1">
                      {housing.price}
                    </h2>
                    <p className="text-white/70">Per person, per month</p>
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
                </motion.div>

                {/* Key Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <h2 className="text-xl font-bold text-white mb-4">Key Details</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Size", value: housing.squareFeet },
                      { label: "Bedrooms", value: housing.bedrooms },
                      { label: "Bathrooms", value: housing.bathrooms },
                      { label: "Distance to Campus", value: housing.distanceToCampus },
                      { label: "Lease Terms", value: housing.leaseTerms },
                      { label: "Available From", value: housing.availabilityDate },
                      { label: "Pet Policy", value: housing.petPolicy },
                    ].map((detail, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-all duration-300">
                        <span className="text-white/70">{detail.label}</span>
                        <span className="text-white font-medium">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Additional Fees */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <h2 className="text-xl font-bold text-white mb-4">Additional Fees</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Security Deposit", value: housing.securityDeposit },
                      { label: "Application Fee", value: housing.applicationFee },
                    ].map((fee, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-all duration-300">
                        <span className="text-white/70">{fee.label}</span>
                        <span className="text-white font-medium">{fee.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300">
                      <div className="p-2 bg-white/10 rounded-full">
                        <Phone size={18} className="text-white/80" />
                      </div>
                      <a
                        href={`tel:${housing.contactPhone}`}
                        className="text-white hover:text-violet-400 transition-colors"
                      >
                        {housing.contactPhone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300">
                      <div className="p-2 bg-white/10 rounded-full">
                        <Info size={18} className="text-white/80" />
                      </div>
                      <a
                        href={`mailto:${housing.contactEmail}`}
                        className="text-white hover:text-violet-400 transition-colors"
                      >
                        {housing.contactEmail}
                      </a>
                    </div>
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-indigo-900/30 border border-indigo-500/30">
                    <p className="text-white/80 text-sm">
                      Mention that you found this listing on UTA Housing when contacting for a special discount!
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Modal */}
        {isReviewsModalOpen && (
          <ReviewsModal
            housingId={housing.id}
            apartmentName={housing.name}
            onClose={() => setIsReviewsModalOpen(false)}
          />
        )}

        {/* Review Form Modal */}
        {isReviewFormOpen && (
          <ReviewForm
            housingId={housing.id}
            apartmentName={housing.name}
            onClose={() => setIsReviewFormOpen(false)}
          />
        )}
      </div>
    </>
  );
}