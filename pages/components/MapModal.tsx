import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HousingLocation {
  id: string;
  title: string;
  location: {
    lat: number;
    lng: number;
  };
}

const MapModal = ({ isOpen, onClose }: MapModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [locations, setLocations] = useState<HousingLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/housing/locations');
        if (!response.ok) throw new Error('Failed to fetch locations');
        const data = await response.json();
        console.log('Fetched locations:', data); // Debug log
        setLocations(data);
      } catch (error) {
        console.error('Error fetching housing locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && mapRef.current && !mapInstance.current && !isLoading) {
      console.log('Initializing map...'); // Debug log
      try {
        // Initialize the map
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 32.7296, lng: -97.1153 }, // UTA coordinates
          zoom: 14,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "all",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "administrative",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }, { lightness: 20 }]
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [{ color: "#000000" }, { lightness: 17 }, { weight: 1.2 }]
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 20 }]
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 21 }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }, { lightness: 17 }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#000000" }, { lightness: 29 }, { weight: 0.2 }]
            },
            {
              featureType: "road.arterial",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 18 }]
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 16 }]
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 19 }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#000000" }, { lightness: 17 }]
            }
          ]
        });

        // Add markers for housing locations
        locations.forEach(location => {
          console.log('Adding marker for:', location); // Debug log
          new google.maps.Marker({
            position: location.location,
            map,
            title: location.title,
            icon: {
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a855f7'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
              scaledSize: new google.maps.Size(40, 40)
            }
          });
        });

        mapInstance.current = map;
        console.log('Map initialized successfully'); // Debug log
      } catch (error) {
        console.error('Error initializing map:', error); // Debug log
      }
    }
  }, [isOpen, locations, isLoading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-6xl h-[80vh] bg-white rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div ref={mapRef} className="w-full h-full" />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MapModal; 