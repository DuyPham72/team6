import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}

const StarRating = ({ rating = 0, size = 16, className = "", showValue = true }: StarRatingProps) => {
  // Convert rating to a visual representation of stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`star-${i}`} 
          className="text-violet-400 fill-violet-400 drop-shadow-glow transition-all duration-300 hover:scale-110" 
          size={size} 
        />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf 
          key="half-star" 
          className="text-violet-400 fill-violet-400 drop-shadow-glow transition-all duration-300 hover:scale-110" 
          size={size} 
        />
      );
    }
    
    // Add empty stars to always show 5 stars total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-star-${i}`} 
          className="text-white/20 transition-all duration-300 hover:text-white/30" 
          size={size} 
        />
      );
    }
    
    return stars;
  };
  
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {renderStars()}
      {showValue && (
        <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 font-medium text-sm">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;