import { motion } from "framer-motion";
import { Loader2, Mail, MessageSquare, Send, Star, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReviewFormProps {
  housingId: number;
  apartmentName: string;
  onClose: () => void;
}

const ReviewForm = ({ housingId, apartmentName, onClose }: ReviewFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !comment) {
      toast.error("Please fill out all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate loading time for demonstration
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          housingId,
          apartmentName,
          name,
          email,
          comment,
          rating,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      
      toast.success("Review submitted successfully!");
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            Rate Your Experience
          </h2>
          <p className="text-white/80 mt-1">at {apartmentName}</p>
          
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                focusedField === 'name' 
                  ? 'bg-white/15 border-violet-500/50' 
                  : 'bg-white/5 border-white/10'
              } border ${isSubmitting ? 'opacity-70' : ''}`}>
                <User className={`w-5 h-5 ${
                  focusedField === 'name' ? 'text-violet-400' : 'text-white/50'
                }`} />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="bg-transparent text-white w-full outline-none placeholder:text-white/40"
                  placeholder="Your name"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div>
              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                focusedField === 'email' 
                  ? 'bg-white/15 border-violet-500/50' 
                  : 'bg-white/5 border-white/10'
              } border ${isSubmitting ? 'opacity-70' : ''}`}>
                <Mail className={`w-5 h-5 ${
                  focusedField === 'email' ? 'text-violet-400' : 'text-white/50'
                }`} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="bg-transparent text-white w-full outline-none placeholder:text-white/40"
                  placeholder="Your email address"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
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
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Review</span>
                  <Send size={18} className="ml-1" />
                </>
              )}
            </motion.button>
          </form>
          
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
                Please wait while we process your review
              </p>
            </div>
          )}
          
          {/* Privacy Notice */}
          <p className="text-white/50 text-xs text-center mt-6">
            Your review helps future residents make informed decisions.
            We value your privacy and will never share your email address.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReviewForm;