// Housing data from your explore.tsx file
export interface HousingListing {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    rating: number;
    image: string;
    amenities: string[];
    type: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
}
  
// Transformed housing options from your data
export const housingListings: HousingListing[] = [
    {
      id: "1",
      title: "Arlington Hall",
      description: "Arlington, TX",
      price: 800,
      location: "Arlington, TX",
      rating: 4.5,
      image: "/Assets/Arlington_Hall.png",
      amenities: ["Wi-Fi", "Fitness Center", "Pool"],
      type: "Residence Hall",
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 650
    },
    {
      id: "2",
      title: "KC Hall",
      description: "Arlington, TX",
      price: 900,
      location: "Arlington, TX",
      rating: 4.2,
      image: "/Assets/KC_Hall.png",
      amenities: ["Parking", "Study Rooms", "Laundry"],
      type: "Residence Hall",
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 700
    },
    {
      id: "4",
      title: "Vandergriff Hall",
      description: "Arlington, TX",
      price: 850,
      location: "Arlington, TX",
      rating: 4.3,
      image: "/Assets/Vandergriff_Hall.png",
      amenities: ["Shuttle Service", "Utilities Included", "Furnished"],
      type: "Residence Hall",
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 600
    },
    {
      id: "5",
      title: "West Hall",
      description: "Arlington, TX",
      price: 700,
      location: "Arlington, TX",
      rating: 4.1,
      image: "/Assets/West_Hall.png",
      amenities: ["On-Campus", "Meal Plan", "24/7 Support"],
      type: "Residence Hall",
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 550
    },
    {
      id: "6",
      title: "Arbor Oaks",
      description: "Arlington, TX",
      price: 720,
      location: "Arlington, TX",
      rating: 4.4,
      image: "/Assets/Arbor_Oaks.jpg",
      amenities: ["Study Lounge", "Community Events", "AC"],
      type: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 600
    },
    {
      id: "7",
      title: "The Heights on Pecan",
      description: "Arlington, TX",
      price: 720,
      location: "Arlington, TX",
      rating: 4.4,
      image: "/Assets/Height_At_Pecan.png",
      amenities: ["Study Lounge", "Community Events", "AC"],
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 750
    },
    {
      id: "8",
      title: "The Lofts",
      description: "Arlington, TX",
      price: 720,
      location: "Arlington, TX",
      rating: 4.4,
      image: "/Assets/Loft.png",
      amenities: ["Study Lounge", "Community Events", "AC"],
      type: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 620
    },
    {
      id: "9",
      title: "Meadow Run",
      description: "Arlington, TX",
      price: 720,
      location: "Arlington, TX",
      rating: 4.4,
      image: "/Assets/Medow_Run.png",
      amenities: ["Study Lounge", "Community Events", "AC"],
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 800
    },
    {
      id: "10",
      title: "Timber Brook",
      description: "Arlington, TX",
      price: 720,
      location: "Arlington, TX",
      rating: 4.4,
      image: "/Assets/Timber_Brook.png",
      amenities: ["Study Lounge", "Community Events", "AC"],
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 750
    },
    {
      id: "11",
      title: "University Village",
      description: "Arlington, TX",
      price: 720,
      location: "Arlington, TX",
      rating: 4.4,
      image: "/Assets/University_Village.png",
      amenities: ["Study Lounge", "Community Events", "AC"],
      type: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 600
    },
    {
      id: "12",
      title: "Centennial Court (Privately Owned)",
      description: "Arlington, TX",
      price: 720,
      location: "Arlington, TX",
      rating: 4.4,
      image: "/Assets/Centennial.jpg",
      amenities: ["Study Lounge", "Community Events", "AC"],
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 850
    }
];
  
export const getHousingListings = (): Promise<HousingListing[]> => {
    // This would typically be an API call, but we're using the static data for now
    return Promise.resolve(housingListings);
};
  
// Parse a natural language query into filter parameters
export const parseHousingQuery = (query: string): Record<string, string> => {
    const params: Record<string, string> = {};
    
    // Extract price information
    const priceMatch = query.match(/\$(\d+)/) || query.match(/(\d+) dollars/);
    if (priceMatch) {
      const price = parseInt(priceMatch[1]);
      if (query.includes('under') || query.includes('less than') || query.includes('below')) {
        params.maxPrice = price.toString();
      } else if (query.includes('over') || query.includes('more than') || query.includes('above')) {
        params.minPrice = price.toString();
      } else {
        // Default to treating it as a maximum price
        params.maxPrice = price.toString();
      }
    }
    
    // Extract bedroom information
    const bedroomMatch = query.match(/(\d+)\s*bed(room)?s?/);
    if (bedroomMatch) {
      params.bedrooms = bedroomMatch[1];
    }
    
    // Extract bathroom information
    const bathroomMatch = query.match(/(\d+)\s*bath(room)?s?/);
    if (bathroomMatch) {
      params.bathrooms = bathroomMatch[1];
    }
    
    // Extract place type (apartment or residence hall)
    if (query.toLowerCase().includes('apartment')) {
      params.placeType = 'Apartment';
    } else if (query.toLowerCase().includes('residence hall') || query.toLowerCase().includes('dorm')) {
      params.placeType = 'Residence Hall';
    }
    
    return params;
};