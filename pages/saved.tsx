import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getLocalSavedListings } from "../lib/utils/localStorage";
import { useToast } from "../Misc/ui/use-toast";
import Navbar from "./components/Navbar";
import StarRating from "./components/StarRating";

interface SavedListing {
  id: string;
  name: string;
  location: string;
  price: string;
  rating: number;
  amenities: string[];
  image: string;
  place: string;
}

export default function SavedPage() {
  const { isSignedIn, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      fetchSavedListings();
    } else {
      // For non-authenticated users, fetch listings from local storage
      const localSavedIds = getLocalSavedListings();
      if (localSavedIds.length > 0) {
        fetchLocalSavedListings(localSavedIds);
      } else {
        setLoading(false);
      }
    }
  }, [isSignedIn]);

  const fetchLocalSavedListings = async (listingIds: string[]) => {
    try {
      const listings: SavedListing[] = [];
      for (const id of listingIds) {
        const response = await fetch(`/api/housing/${id}`);
        if (response.ok) {
          const listing = await response.json();
          listings.push(listing);
        }
      }
      setSavedListings(listings);
      if (listings.length === 0) {
        toast({
          title: "No Saved Listings",
          description: "You haven't saved any listings yet.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error fetching local saved listings:', error);
      toast({
        title: "Error",
        description: "Failed to load saved listings!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedListings = async () => {
    try {
      const response = await fetch("/api/saved");
      if (response.ok) {
        const data = await response.json();
        console.log("Saved listings data:", data);
        
        // Fetch full listing details for each saved listing
        const listingDetails = await Promise.all(
          data.map(async (item: { listingId: string }) => {
            try {
              const listingResponse = await fetch(`/api/housing/${item.listingId}`);
              if (listingResponse.ok) {
                const listing = await listingResponse.json();
                console.log("Fetched listing:", listing);
                return listing;
              } else {
                console.error(`Failed to fetch listing ${item.listingId}:`, await listingResponse.text());
                return null;
              }
            } catch (error) {
              console.error(`Error fetching listing ${item.listingId}:`, error);
              return null;
            }
          })
        );
        
        const validListings = listingDetails.filter(Boolean);
        console.log("Valid listings:", validListings);
        setSavedListings(validListings);
      } else {
        console.error("Failed to fetch saved listings:", await response.text());
        toast({
          title: "Error",
          description: "Failed to load saved listings!",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching saved listings:", error);
      toast({
        title: "Error",
        description: "Failed to saved listings! Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (listingId: string) => {
    if (isSignedIn) {
      try {
        const response = await fetch("/api/saved", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ listingId }),
        });

        if (response.ok) {
          setSavedListings(savedListings.filter((listing) => listing.id !== listingId));
          toast({
            title: "Error",
            description: "Listing removed from saved!",
            variant: "destructive",
          })
        } else {
          throw new Error("Failed to remove listing");
        }
      } catch (error) {
        console.error("Error removing saved listing:", error);
        toast({
          title: "Error",
          description: "Failed to remove listing! Please try again later.",
          variant: "destructive",
        })
      }
    } else {
      // For non-authenticated users, remove from local storage
      const localSavedIds = getLocalSavedListings();
      localStorage.setItem('saved_listings', JSON.stringify(localSavedIds.filter(id => id !== listingId)));
      setSavedListings(savedListings.filter((listing) => listing.id !== listingId));
      toast({
        title: "Error",
        description: "Listing removed from saved!",
        variant: "destructive",
      })
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/housing/${id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar setIsMenuOpen={setIsMenuOpen} />
        <div className="min-h-screen bg-[#111827] text-white">
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto mb-4" />
            <p className="text-white/60">Loading your saved listings...</p>
          </div>
        </div>
      </>
    );
  }

  if (savedListings.length === 0) {
    return (
      <>
        <Navbar setIsMenuOpen={setIsMenuOpen} />
        <div className="min-h-screen bg-[#111827] text-white">
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <h1 className="text-4xl font-bold mb-6">No Saved Listings</h1>
            <p className="text-white/60 mb-8">
              You haven't saved any housing listings yet. Browse available options and save your favorites!
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors"
            >
              Browse Listings
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar setIsMenuOpen={setIsMenuOpen} />
      <div className="min-h-screen bg-[#111827] text-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">
              {isSignedIn ? "Your Saved Listings" : "Saved Listings"}
            </h1>
            <p className="text-white/60">
              {isSignedIn
                ? "Manage your saved housing listings"
                : "Your locally saved housing listings"}
            </p>
            {!isSignedIn && (
              <p className="text-white/60 mt-2 text-sm">
                Sign in to sync your saved listings across devices
              </p>
            )}
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {savedListings.map((listing) => (
              <motion.div
                key={listing.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="relative group rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:border-violet-500/50 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <div className="bg-black/60 backdrop-blur-md py-1 px-2 rounded-lg">
                      <StarRating rating={listing.rating} size={16} />
                    </div>
                    <button
                      onClick={() => handleRemoveSaved(listing.id)}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-colors duration-300"
                    >
                      <Heart className="w-5 h-5 text-violet-400 fill-current" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors duration-300">
                        {listing.name}
                      </h2>
                      <div className="flex items-center text-white/60 space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{listing.location}</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                      {listing.price}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewDetails(listing.id)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl transition-all duration-300 shadow-lg shadow-violet-600/20"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
} 