import { MapPin } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Arbor_Oaks from "../../public/Assets/Arbor_Oaks.jpeg";
import Arlinton_Hall from "../../public/Assets/Arlington_Hall.png";
import Centinnial from "../../public/Assets/Centennial.jpg";
import Height_At_Pecan from "../../public/Assets/Height_At_Pecan.png";
import KC_Hall from "../../public/Assets/KC_Hall.png";
import Loft from "../../public/Assets/Loft.png";
import Meadow_Run from "../../public/Assets/Medow_Run.png";
import Timber_Brook from "../../public/Assets/Timber_Brook.png";
import University_Village from "../../public/Assets/University_Village.png";
import Vandergriff_Hall from "../../public/Assets/Vandergriff_Hall.png";
import West_Hall from "../../public/Assets/West_Hall.png";
import StarRating from "../components/StarRating";


// Mock data for housing options (same as in Explore component)
const housingOptions = [
    {
        id: 1,
        name: "Arlington Hall",
        location: "Arlington, TX",
        price: "$800/month",
        rating: 4.5,
        amenities: ["Wi-Fi", "Fitness Center", "Pool"],
        image: Arlinton_Hall.src,
        place: "Residence Hall",
      },
      {
        id: 2,
        name: "KC Hall",
        location: "Arlington, TX",
        price: "$900/month",
        rating: 4.2,
        amenities: ["Parking", "Study Rooms", "Laundry"],
        image: KC_Hall.src,
        place: "Residence Hall",
      },
      // {
      //   id: 3,
      //   name: "Maverick Hall",
      //   location: "Arlington, TX",
      //   price: "$750/month",
      //   rating: 4.7,
      //   amenities: ["Security", "Game Room", "Pet Friendly"],
      //   image: "/api/placeholder/400/250",
      //   place: "Residence Hall",
      // },
      {
        id: 4,
        name: "Vandergriff Hall",
        location: "Arlington, TX",
        price: "$850/month",
        rating: 4.3,
        amenities: ["Shuttle Service", "Utilities Included", "Furnished"],
        image: Vandergriff_Hall.src,
        place: "Residence Hall",
      },
      {
        id: 5,
        name: "West Hall",
        location: "Arlington, TX",
        price: "$700/month",
        rating: 4.1,
        amenities: ["On-Campus", "Meal Plan", "24/7 Support"],
        image: West_Hall.src,
        place: "Residence Hall",
      },
      {
        id: 6,
        name: "Arbor Oaks",
        location: "Arlington, TX",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Arbor_Oaks.src,
        place: "Apartment",
      },
      {
        id: 7,
        name: "The Heights on Pecan",
        location: "Arlington, TX",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Height_At_Pecan.src,
        place: "Apartment",
      },
      {
        id: 8,
        name: "The Lofts",
        location: "Arlington, TX",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Loft.src,
        place: "Apartment",
      },
      {
        id: 9,
        name: "Meadow Run",
        location: "Arlington, TX",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Meadow_Run.src,
        place: "Apartment",
      },
      {
        id: 10,
        name: "Timber Brook",
        location: "Arlington, TX",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Timber_Brook.src,
        place: "Apartment",
      },
      {
        id: 11,
        name: "University Village",
        location: "Arlington, TX",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: University_Village.src,
        place: "Apartment",
      },
      {
        id: 12,
        name: "Centennial Court (Privately Owned)",
        location: "Arlington, TX",
        price: "$720/month",
        rating: 4.4,
        amenities: ["Study Lounge", "Community Events", "AC"],
        image: Centinnial.src,
        place: "Apartment",
      },
  // Add other housing options here...
];

const HousingDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Get the `id` parameter from the URL
  const [housing, setHousing] = useState<typeof housingOptions[0] | null>(null);

  useEffect(() => {
    if (id) {
      const selectedHousing = housingOptions.find(
        (option) => option.id === parseInt(id as string)
      );
      if (selectedHousing) {
        setHousing(selectedHousing);
      } else {
        router.push("/404");
      }
    }
  }, [id, router]);

  if (!housing) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="p-10 bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative group overflow-hidden">
            <img
              src={housing.image}
              alt={housing.name}
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />
          </div>
          
          {/* Details Section */}
          <div className="p-8 text-white">
            <h1 className="text-4xl font-extrabold tracking-wide text-violet-400">{housing.name}</h1>
            <div className="flex items-center text-white/60 space-x-2 mt-4">
              <MapPin className="w-5 h-5 text-violet-300" />
              <span className="text-lg">{housing.location}</span>
            </div>
            <div className="flex items-center mt-4">
              <StarRating rating={housing.rating} size={24} />
            </div>
            <p className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 mt-6">
              {housing.price}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {housing.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="text-sm bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-md shadow-md"
                >
                  {amenity}
                </span>
              ))}
            </div>
            <p className="text-white/70 mt-6 leading-relaxed">
              This is a <span className="text-violet-300 font-semibold">{housing.place}</span> located in {housing.location}. It offers top-tier amenities to ensure a comfortable and luxurious experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousingDetail;