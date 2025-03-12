import { AnimatePresence, motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import StarRating from "./StarRating";

interface ReviewsModalProps {
  housingId: number;
  apartmentName: string;
  onClose: () => void;
}

const ReviewsModal = ({ housingId, apartmentName, onClose }: ReviewsModalProps) => {
  const [reviews, setReviews] = useState<{ id: number; user: string; comment: string; rating: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/getReviews?housingId=${housingId}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        
        const data = await response.json();
        const fetchedReviews = data.reviews || [];
        setReviews(fetchedReviews);
        
        // Calculate average rating
        if (fetchedReviews.length > 0) {
          const totalRating = fetchedReviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
          setAverageRating(totalRating / fetchedReviews.length);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [housingId]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      scale: 0.9, 
      opacity: 0, 
      y: 20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const reviewItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * custom,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: { 
      opacity: 0, 
      y: 10,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-gradient-to-br from-black/80 via-violet-900/30 to-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden w-full max-w-md relative max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient header bar */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">Reviews</h2>
                <p className="text-white/60 text-sm">for {apartmentName}</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="flex items-center justify-center w-10 h-10 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Average rating */}
            {!loading && reviews.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-4 bg-white/5 p-4 rounded-lg border border-white/10 group hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <p className="text-white text-sm">Average Rating</p>
                  <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                    {averageRating.toFixed(1)}
                  </p>
                </div>
                <div className="mt-2">
                  <StarRating rating={averageRating} size={24} />
                </div>
              </motion.div>
            )}

            {/* Review content */}
            <div className="overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-violet-500 animate-spin"></div>
                </div>
              ) : reviews.length > 0 ? (
                <motion.div className="space-y-4">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={reviewItemVariants}
                      initial="hidden"
                      animate="visible"
                      className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-white font-medium">{review.user}</p>
                        <StarRating rating={review.rating} size={16} />
                      </div>
                      <p className="text-white text-sm">{review.comment}</p>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white/5 rounded-lg p-6 text-center"
                >
                  <div className="mb-4 flex justify-center">
                    <Star className="h-12 w-12 text-white/20" />
                  </div>
                  <p className="text-white">No reviews yet for this property.</p>
                  <p className="mt-2 text-sm text-violet-200">Be the first to leave a review!</p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="mt-6 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-lg transition duration-300 w-full shadow-lg shadow-violet-600/20 font-medium"
            >
              Close
            </motion.button>
          </div>

          {/* Decorative Element */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.8 } }}
            className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-violet-500/10 to-transparent pointer-events-none"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewsModal;