import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Star, X, MessageCircle, ThumbsUp, ThumbsDown, Edit2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import StarRating from "./StarRating";
import { useUser } from "@clerk/nextjs";
import EditReviewForm from "./EditReviewForm";
import Loader from "../../components/ui/Loader";

interface Review {
  _id: string;
  userId: string;
  housingId: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
}

interface ReviewsModalProps {
  housingId: string;
  apartmentName: string;
  onClose: () => void;
  onReviewsRefreshed: (averageRating: number) => void;
  onReviewSubmitted?: () => void;
}

const ReviewsModal = ({ housingId, apartmentName, onClose, onReviewsRefreshed, onReviewSubmitted }: ReviewsModalProps) => {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">("overview");
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [housingId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/getReviews?housingId=${housingId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      
      const data = await response.json();
      const fetchedReviews = data.reviews || [];
      
      // Debug information
      console.log('Current user:', user?.id);
      console.log('Fetched reviews:', fetchedReviews);
      console.log('Review user IDs:', fetchedReviews.map((review: Review) => review.userId));
      
      setReviews(fetchedReviews);
      
      // Calculate average rating
      if (fetchedReviews.length > 0) {
        const totalRating = fetchedReviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
        const avg = totalRating / fetchedReviews.length;
        setAverageRating(avg);
        onReviewsRefreshed(avg);
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        setAverageRating(0);
        onReviewsRefreshed(0);
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
  };

  const handleReviewUpdated = () => {
    setEditingReview(null);
    fetchReviews();
  };

  const getRatingDistribution = () => {
    const distribution = Array(5).fill(0);
    reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    return distribution;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      scale: 0.95, 
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
        ease: [0.22, 1, 0.36, 1]
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

  const tabVariants = {
    active: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    inactive: { 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {/* Reviews Modal */}
      <motion.div
        key="reviews-modal-backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-gradient-to-br from-black/90 via-violet-900/40 to-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 blur-3xl"
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
            className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-3xl"
          />
        </div>

        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden w-full max-w-2xl relative max-h-[85vh] flex flex-col shadow-2xl shadow-violet-900/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated header bar */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 relative overflow-hidden">
            <motion.div
              animate={{
                x: ["0%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">Reviews</h2>
                <p className="text-white/60 text-sm mt-1">for {apartmentName}</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="flex items-center justify-center w-10 h-10 text-white/60 hover:text-white bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 rounded-lg border border-white/10 backdrop-blur-sm transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-violet-500/20"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-6">
              <motion.button
                variants={tabVariants}
                animate={activeTab === 'overview' ? 'active' : 'inactive'}
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 text-white shadow-lg shadow-violet-600/20' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                Overview
              </motion.button>
              <motion.button
                variants={tabVariants}
                animate={activeTab === 'reviews' ? 'active' : 'inactive'}
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'reviews' 
                    ? 'bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 text-white shadow-lg shadow-violet-600/20' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                Reviews ({reviews.length})
              </motion.button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Rating Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Average Rating Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white/5 p-5 rounded-xl border border-white/10 group hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-white text-sm font-medium">Average Rating</p>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                        <Star className="h-5 w-5 text-violet-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <StarRating rating={averageRating} size={24} />
                      <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        {averageRating.toFixed(1)}
                      </p>
                    </div>
                  </motion.div>

                  {/* Total Reviews Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white/5 p-5 rounded-xl border border-white/10 group hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-white text-sm font-medium">Total Reviews</p>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-violet-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-white/70 text-sm">Based on {reviews.length} reviews</p>
                      <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        {reviews.length}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Rating Distribution */}
                {!loading && reviews.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-white/5 p-5 rounded-xl border border-white/10 group hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    <h3 className="text-white font-medium mb-4">Rating Distribution</h3>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => Math.round(r.rating) === rating).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-16">
                              <span className="text-white/70 text-sm">{rating}</span>
                              <Star className="h-3 w-3 text-violet-400 fill-violet-400" />
                            </div>
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ delay: 0.5 + (rating * 0.1), duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                              />
                            </div>
                            <span className="text-white/70 text-sm w-12 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar"
              >
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader />
                  </div>
                ) : reviews.length > 0 ? (
                  <motion.div className="space-y-4">
                    {reviews.map((review) => (
                      <motion.div
                        key={review._id.toString()}
                        custom={review._id.toString()}
                        variants={reviewItemVariants}
                        initial="hidden"
                        animate="visible"
                        className="p-5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300 backdrop-blur-sm group"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30 transition-all duration-300">
                              <span className="text-white font-medium text-sm">
                                {review.isAnonymous ? "A" : "U"}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{review.isAnonymous ? "Anonymous" : "User"}</p>
                              <p className="text-white/60 text-xs">Reviewer</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} size={16} />
                            {/* Show edit button for non-anonymous reviews by the current user */}
                            {user && review.userId === user.id && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditReview(review)}
                                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-300"
                                title="Edit your review"
                              >
                                <Edit2 size={16} />
                              </motion.button>
                            )}
                          </div>
                        </div>
                        <p className="text-white/90 text-sm ml-13 pl-1 border-l-2 border-violet-500/30">{review.comment}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white/5 rounded-xl p-8 text-center backdrop-blur-sm"
                  >
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center">
                        <Star className="h-8 w-8 text-white/30" />
                      </div>
                    </div>
                    <p className="text-white text-lg">No reviews yet for this property.</p>
                    <p className="mt-2 text-sm text-violet-200">Be the first to leave a review!</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Footer */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="mt-6 px-4 py-3 bg-gradient-to-br from-violet-600/90 to-fuchsia-600/90 hover:from-violet-500/90 hover:to-fuchsia-500/90 text-white rounded-xl transition-all duration-300 w-full shadow-lg shadow-violet-600/20 font-medium backdrop-blur-sm border border-white/10 hover:border-white/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-2">
                Close
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.button>
          </div>

          {/* Decorative Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.8 } }}
            className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-violet-500/10 to-transparent pointer-events-none"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.7, duration: 0.8 } }}
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/5 to-transparent rounded-full blur-2xl pointer-events-none"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.9, duration: 0.8 } }}
            className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-fuchsia-500/5 to-transparent rounded-full blur-2xl pointer-events-none"
          />
        </motion.div>
      </motion.div>

      {/* Edit Review Form */}
      {editingReview && (
        <motion.div
          key="edit-review-form-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <EditReviewForm
            reviewId={editingReview._id}
            housingId={housingId}
            apartmentName={apartmentName}
            initialComment={editingReview.comment}
            initialRating={editingReview.rating}
            initialIsAnonymous={editingReview.isAnonymous}
            onClose={() => setEditingReview(null)}
            onReviewUpdated={handleReviewUpdated}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewsModal;