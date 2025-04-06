import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface Review {
  _id?: string;
  housingId: number;
  userId?: string;
  name?: string;
  rating: number;
  comment: string;
  location?: string;
  date?: string;
  userImage?: string;
}

// Transform API review to testimonial format
const mapReviewToTestimonial = (review: Review) => ({
  quote: review.comment,
  author: review.name || "Anonymous User",
  location: review.location || "UTA Campus",
  rating: review.rating,
  image: review.userImage || undefined
});

// Fallback testimonials in case API fails
const fallbackTestimonials = [
  {
    quote: "Using UTA has transformed my home search experience! I found my dream home in no time and loved sharing my review with others.",
    author: "Trudy Johnson",
    location: "Northgate, West Side",
    rating: 5,
    image: "/Assets/testimonial1.jpg"
  },
  {
    quote: "MavPads helped me find a great apartment close to campus with amazing amenities. Their verification process made me feel safe.",
    author: "Michael Wilson",
    location: "Centerville, South Campus",
    rating: 5,
    image: "/Assets/testimonial2.jpg"
  },
  {
    quote: "As a transfer student, I was worried about finding housing mid-semester. MavPads made it so easy to connect with landlords.",
    author: "Sarah Parker",
    location: "Downtown, East End",
    rating: 4,
    image: "/Assets/testimonial3.jpg"
  }
];

interface TestimonialsSectionProps {
  housingId?: number;
}

const TestimonialsSection = ({ housingId = 1 }: TestimonialsSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);
  
  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/getReviews?housingId=${housingId}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const mappedTestimonials = data.reviews.map(mapReviewToTestimonial);
          setTestimonials(mappedTestimonials);
          setTotalReviews(mappedTestimonials.length);
          setApiError(null);
        } else {
          console.warn('No reviews found for this housing. Using fallback testimonials.');
          setTotalReviews(fallbackTestimonials.length);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setApiError('Temporarily using sample testimonials.');
        setTotalReviews(fallbackTestimonials.length);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, [housingId]);

  // Auto-rotation logic
  useEffect(() => {
    if (!isAutoRotating || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [isAutoRotating, testimonials.length]);

  const nextTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoRotating(false); // Pause auto-rotation when manually navigating
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoRotating(false); // Pause auto-rotation when manually navigating
  }, [testimonials.length]);

  // Resume auto-rotation after 30 seconds of inactivity
  useEffect(() => {
    if (!isAutoRotating) {
      const timeout = setTimeout(() => {
        setIsAutoRotating(true);
      }, 30000); // Resume after 30 seconds

      return () => clearTimeout(timeout);
    }
  }, [isAutoRotating]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative py-20 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-violet-900/70 z-10" />
      </div>

      {/* Content */}
      <div className="container relative z-20 mx-auto px-6 md:px-10">
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-white/90 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <Star className="w-4 h-4" />
            What Our Students Say
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400">
              Student Testimonials
            </span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Hear from students who found their perfect home through MavPads
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-violet-500 animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < testimonials[activeIndex].rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>

                  <blockquote className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                    "{testimonials[activeIndex].quote}"
                  </blockquote>

                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {testimonials[activeIndex].author.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">{testimonials[activeIndex].author}</p>
                      <p className="text-white/60 text-sm">{testimonials[activeIndex].location}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation and Pagination */}
          <div className="flex flex-col items-center gap-4 mt-8">
            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevTestimonial}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextTestimonial}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Pagination and Auto-rotation Indicator */}
            <div className="flex flex-col items-center gap-2">
              {/* Review Counter */}
              <div className="text-white/60 text-sm">
                Review {activeIndex + 1} of {totalReviews}
              </div>

              {/* Auto-rotation indicator */}
              {testimonials.length > 1 && (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isAutoRotating ? 'bg-violet-500' : 'bg-white/20'
                  }`} />
                  <span className="text-white/60 text-sm">
                    {isAutoRotating ? 'Auto-rotating' : 'Paused'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8 text-white/60 text-sm"
          >
            {apiError}
          </motion.div>
        )}
      </div>

      {/* Decorative Bottom Gradient */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-violet-500/20 to-transparent pointer-events-none"
      />
    </motion.section>
  );
};

export default TestimonialsSection;