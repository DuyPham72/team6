import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Loader2, MessageSquare, Send, Star, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "../../Misc/ui/label";
import { Switch } from "../../Misc/ui/switch";

interface EditReviewFormProps {
  reviewId: string;
  housingId: string;
  apartmentName: string;
  initialComment: string;
  initialRating: number;
  initialIsAnonymous: boolean;
  onClose: () => void;
  onReviewUpdated?: (updatedReview: any) => void;
}

const EditReviewForm = ({ 
  reviewId, 
  housingId, 
  apartmentName, 
  initialComment, 
  initialRating, 
  initialIsAnonymous,
  onClose, 
  onReviewUpdated 
}: EditReviewFormProps) => {
  const { isSignedIn, user } = useUser();
  const [comment, setComment] = useState(initialComment);
  const [rating, setRating] = useState(initialRating);
  const [isAnonymous, setIsAnonymous] = useState(initialIsAnonymous);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      setError("You must be signed in to edit a review");
      return;
    }
    if (!comment.trim()) {
      setError("Please enter a comment");
      return;
    }
    try {
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
          comment,
          rating,
          isAnonymous,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update review");
      }

      const updatedReview = await response.json();
      if (onReviewUpdated) {
        onReviewUpdated(updatedReview);
      }
      onClose();
    } catch (error) {
      console.error("Error updating review:", error);
      setError(error instanceof Error ? error.message : "Failed to update review");
    }
  };

  // Loading spinner animation variants
  const spinTransition = {
    repeat: Infinity,
    duration: 1,
    ease: "linear"
  };

  // Pulse animation for submit button while loading
  const pulseAnimation = {
    scale: [1, 1.02, 1],
    opacity: [0.7, 0.9, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Star hover animation
  const starHoverAnimation = {
    scale: 1.2,
    y: -5,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 rounded-t-2xl">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="h-6 w-6" />
          </motion.button>
          
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Star className="h-6 w-6 mr-2 text-yellow-300 fill-yellow-300" />
            Edit Your Review
          </h2>
          <p className="text-white/80 mt-1">for {apartmentName}</p>
          
          {/* User Info - Show only if signed in */}
          {isSignedIn && (
            <div className="mt-3 text-white/90 flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Posting as: {isAnonymous ? "Anonymous" : (user?.fullName || user?.firstName || "User")}
              </span>
            </div>
          )}
          
          {/* Rating Stars */}
          <div className="mt-6 flex justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={starHoverAnimation}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                className="px-2"
                disabled={isSubmitting}
              >
                <Star 
                  size={32} 
                  className={`transition-all duration-300 ${
                    rating >= star 
                      ? 'text-yellow-300 fill-yellow-300' 
                      : 'text-white/30'
                  } ${isSubmitting ? 'opacity-70' : ''}`} 
                />
              </motion.button>
            ))}
          </div>
          <p className="text-white/80 text-center mt-2 text-sm">
            {rating === 1 && "Poor"}
            {rating === 2 && "Below Average"}
            {rating === 3 && "Average"}
            {rating === 4 && "Good"}
            {rating === 5 && "Excellent"}
          </p>
        </div>
        
        {/* Form Section */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-b-2xl">
          {!isSignedIn ? (
            <div className="text-center p-6">
              <h3 className="text-white text-lg mb-4">Sign in to edit your review</h3>
              <p className="text-white/70 mb-6 text-sm">
                You need to be signed in to edit your review.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-white/50" />
                  <Label htmlFor="anonymous-toggle" className="text-white cursor-pointer">
                    Post Anonymously
                  </Label>
                </div>
                <Switch
                  id="anonymous-toggle"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  disabled={isSubmitting}
                  className="data-[state=checked]:bg-violet-500 w-10"
                />
              </div>
              
              {/* Comment Textarea */}
              <div>
                <div className={`flex gap-3 p-3 rounded-xl transition-all duration-300 ${
                  focusedField === 'comment' 
                    ? 'bg-white/15 border-violet-500/50' 
                    : 'bg-white/5 border-white/10'
                } border ${isSubmitting ? 'opacity-70' : ''}`}>
                  <MessageSquare className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    focusedField === 'comment' ? 'text-violet-400' : 'text-white/50'
                  }`} />
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onFocus={() => setFocusedField('comment')}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    className="bg-transparent text-white w-full outline-none resize-none placeholder:text-white/40"
                    placeholder="Share your honest experience..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <motion.button
                whileHover={isSubmitting ? {} : { scale: 1.02 }}
                whileTap={isSubmitting ? {} : { scale: 0.98 }}
                animate={isSubmitting ? pulseAnimation : {}}
                disabled={isSubmitting}
                type="submit"
                className={`w-full py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting 
                    ? 'bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 text-white/90 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={spinTransition}
                    >
                      <Loader2 className="h-5 w-5 mr-2" />
                    </motion.div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>Update Review</span>
                    <Send size={18} className="ml-1" />
                  </>
                )}
              </motion.button>
            </form>
          )}
          
          {/* Progress indicator during submission */}
          {isSubmitting && (
            <div className="mt-4">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: ["0%", "50%", "75%", "90%"],
                  }}
                  transition={{ 
                    duration: 3, 
                    ease: "easeInOut",
                    times: [0, 0.4, 0.7, 0.9]
                  }}
                  className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full"
                />
              </div>
              <p className="text-white/50 text-xs text-center mt-2">
                Please wait while we update your review
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditReviewForm; 