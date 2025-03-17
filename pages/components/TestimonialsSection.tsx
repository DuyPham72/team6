import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

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
  housingId?: number; // Optional property to specify which housing to show reviews for
}
const TestimonialsSection = ({ housingId = 1 }: TestimonialsSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      try {
        // Make API request with housingId parameter
        const response = await fetch(`/api/getReviews?housingId=${housingId}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if we got reviews back
        if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          // Transform reviews to testimonial format
          const mappedTestimonials = data.reviews.map(mapReviewToTestimonial);
          setTestimonials(mappedTestimonials);
          setApiError(null);
        } else {
          console.warn('No reviews found for this housing. Using fallback testimonials.');
          // Keep using fallback data
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setApiError('Temporarily using sample testimonials.');
        // Keep using fallback testimonials
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, [housingId]); // Re-fetch if housingId changes

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Animation variants
  const testimonialVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-24 relative bg-gradient-to-b from-black to-violet-900/70 text-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl relative z-10 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white/80">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative bg-gradient-to-b from-black to-violet-900/70 text-white overflow-hidden">
      {/* Background gradient decorations */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-violet-600/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-fuchsia-300"
        >
          What Students Are Saying
        </motion.h2>
        
        {/* Show API error notice if applicable */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <p className="text-sm text-yellow-300/80">{apiError}</p>
          </motion.div>
        )}
        
        <div className="flex justify-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={24} 
                className="text-yellow-400 fill-yellow-400 mr-1" 
              />
            ))}
          </motion.div>
        </div>
        
        <div className="relative overflow-hidden px-6 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={testimonialVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center max-w-3xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-white/10 shadow-xl shadow-violet-900/20 mb-8">
                <p className="text-lg md:text-xl italic text-white/90 mb-8 leading-relaxed">
                  "{testimonials[activeIndex].quote}"
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="relative w-14 h-14 overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 p-0.5">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                    {testimonials[activeIndex].image ? (
                      <img 
                        src={testimonials[activeIndex].image} 
                        alt={testimonials[activeIndex].author}
                        className="w-full h-full object-cover rounded-full" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">{testimonials[activeIndex].author}</p>
                    <p className="text-sm text-white/60">{testimonials[activeIndex].location}</p>
                    <div className="flex mt-1">
                      {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                        <Star key={i} size={12} className="text-yellow-400 fill-yellow-400 mr-0.5" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation arrows */}
          {testimonials.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <ChevronRight size={20} />
              </motion.button>
            </>
          )}
        </div>
        
        {/* Dot indicators */}
        {testimonials.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 scale-110' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;