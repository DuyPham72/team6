import React, { useEffect, useState } from "react";
import { X, BedDouble, Bath, Ruler, Calendar, DollarSign, Building } from "lucide-react";
import { HousingOption } from "./explore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHousing: HousingOption[];
}

export default function ComparisonModal({ isOpen, onClose, selectedHousing }: ComparisonModalProps) {
  const [savedListings, setSavedListings] = useState<string[]>([]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const features = [
    { key: "price", label: "Price", icon: DollarSign },
    { key: "bedrooms", label: "Bedrooms", icon: BedDouble },
    { key: "bathrooms", label: "Bathrooms", icon: Bath },
    { key: "squareFeet", label: "Square Feet", icon: Ruler },
    { key: "leaseLength", label: "Lease Length", icon: Calendar },
    { key: "place", label: "Type", icon: Building },
  ];

  const handleSaveListing = async (housing: HousingOption) => {
    try {
      const response = await fetch('/api/saveListing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: housing.id }),
      });

      if (response.ok) {
        toast.success("Listing saved successfully!");
      } else {
        toast.error("Failed to save listing. Please try again.");
      }
    } catch (error) {
      console.error('Error saving listing:', error);
      toast.error("Failed to save listing. Please try again.");
    }
  };

  const handleRemoveListing = (housing: HousingOption) => {
    // Remove from local storage
    const updatedListings = savedListings.filter((id: string) => id !== housing.id);
    setSavedListings(updatedListings);
    localStorage.setItem('savedListings', JSON.stringify(updatedListings));
    toast.success("Listing removed from saved items");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(123,97,255,0.1)_0%,rgba(123,97,255,0)_50%)]" />
            <motion.div
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }}
              className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl"
            />
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ 
              duration: 0.4,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="bg-[#0f1729]/90 backdrop-blur-md rounded-3xl w-full max-w-7xl max-h-[90vh] overflow-hidden border border-purple-500/30 shadow-lg shadow-purple-500/10 relative mx-4 sm:mx-6 lg:mx-8"
          >
            {/* Decorative grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(123,97,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(123,97,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-3xl opacity-20">
              <div className="absolute inset-px rounded-3xl bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-borderGlow" />
            </div>

            {/* Header */}
            <div className="p-4 sm:p-6 flex justify-between items-center sticky top-0 z-10 bg-[#0f1729]/90 backdrop-blur-md border-b border-purple-400/20">
              <motion.div 
                initial={{ x: -20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="flex items-center"
              >
                {/* Animated accent line */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "2rem" }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="w-0.5 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full mr-3 relative"
                >
                  <motion.div
                    animate={{
                      top: ["0%", "100%", "0%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute w-full h-1/3 bg-gradient-to-b from-transparent via-white to-transparent"
                  />
                </motion.div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">
                  Property Comparison
                </h2>
              </motion.div>
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                onClick={onClose}
                className="p-2 hover:bg-purple-500/10 rounded-full transition-all duration-300 border border-transparent hover:border-purple-500/20 group"
              >
                <X className="w-6 h-6 text-purple-400 transition-transform duration-300 group-hover:rotate-90" />
              </motion.button>
            </div>
            
            <div className="relative overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-500/20">
              {/* Property Images Row */}
              <div className="grid grid-cols-1 sm:grid-cols-[150px_repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-[200px_repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 pb-0">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center"
                >
                  <div className="w-1 h-16 bg-gradient-to-b from-purple-400/50 to-fuchsia-400/50 rounded-full mr-3 relative">
                    <motion.div
                      animate={{
                        top: ["0%", "100%", "0%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute w-full h-1/3 bg-gradient-to-b from-transparent via-white to-transparent"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-white">Properties</h3>
                </motion.div>
                
                {selectedHousing.map((property, index) => (
                  <motion.div 
                    key={`${property.id}-header`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.6,
                      delay: 0.3 + index * 0.1,
                      ease: [0.19, 1, 0.22, 1]
                    }}
                    className="h-[200px] sm:h-[220px] lg:h-[250px] group"
                  >
                    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-purple-500/20 shadow-lg shadow-purple-500/5 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-purple-500/20">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1729] via-[#0f1729]/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "3rem" }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                          className="h-1 bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-full mb-3"
                        />
                        <h3 className="text-xl font-bold text-white mb-1">{property.name}</h3>
                        <p className="text-sm text-white/60">{property.location}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main comparison grid */}
              <div className="p-4 sm:p-6">
                <div className="relative">
                  {/* Features */}
                  {features.map((feature, featureIndex) => (
                    <motion.div 
                      key={feature.key}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ 
                        duration: 0.5,
                        delay: 0.4 + featureIndex * 0.05,
                        ease: [0.19, 1, 0.22, 1]
                      }}
                      className="grid grid-cols-1 sm:grid-cols-[150px_repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-[200px_repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 group"
                    >
                      <div className="flex items-center gap-3 text-white/80">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 transition-all duration-300 group-hover:bg-purple-500/20 group-hover:border-purple-500/30">
                          <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                        </div>
                        <span className="font-medium text-sm sm:text-base">{feature.label}</span>
                      </div>
                      
                      {selectedHousing.map((property, index) => (
                        <motion.div 
                          key={`${property.id}-${feature.key}`}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ 
                            duration: 0.4,
                            delay: 0.5 + featureIndex * 0.05 + index * 0.05,
                            ease: [0.19, 1, 0.22, 1]
                          }}
                          className="text-white h-10 sm:h-12 flex items-center pl-4 rounded-lg bg-white/5 border border-purple-500/10 backdrop-blur-sm transition-all duration-300 hover:bg-purple-500/5 hover:border-purple-500/20 text-sm sm:text-base"
                        >
                          {property[feature.key as keyof HousingOption]}
                        </motion.div>
                      ))}
                    </motion.div>
                  ))}

                  {/* Amenities */}
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.5,
                      delay: 0.6,
                      ease: [0.19, 1, 0.22, 1]
                    }}
                    className="grid grid-cols-1 sm:grid-cols-[150px_repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-[200px_repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6 lg:gap-8 group"
                  >
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 transition-all duration-300 group-hover:bg-purple-500/20 group-hover:border-purple-500/30">
                        <Building className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">Amenities</span>
                    </div>
                    
                    {selectedHousing.map((property, index) => (
                      <motion.div 
                        key={`${property.id}-amenities`}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ 
                          duration: 0.4,
                          delay: 0.7 + index * 0.05,
                          ease: [0.19, 1, 0.22, 1]
                        }}
                        className="flex flex-wrap gap-2 p-3 sm:p-4 rounded-lg bg-white/5 border border-purple-500/10 backdrop-blur-sm transition-all duration-300 hover:bg-purple-500/5 hover:border-purple-500/20"
                      >
                        {property.amenities.map((amenity, amenityIndex) => (
                          <motion.span
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                              duration: 0.3,
                              delay: 0.8 + index * 0.05 + amenityIndex * 0.02,
                              ease: [0.19, 1, 0.22, 1]
                            }}
                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-white/80 bg-purple-500/10 rounded-full border border-purple-500/20 transition-all duration-300 hover:bg-purple-500/20 hover:border-purple-500/30"
                          >
                            {amenity}
                          </motion.span>
                        ))}
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -left-4 top-1/2 w-1 h-1/3 bg-gradient-to-b from-purple-500/0 via-purple-500/30 to-purple-500/0 rounded-full">
                    <motion.div
                      animate={{
                        top: ["0%", "100%", "0%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute w-full h-1/3 bg-gradient-to-b from-transparent via-white to-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}