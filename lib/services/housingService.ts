// Housing data from your explore.tsx file
export interface HousingListing {
    id: string;
    title: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    imageUrl: string;
    amenities: string[];
    rating?: number;
    place?: string;
  }
  
  // Transformed housing options from your data
  export const housingListings: HousingListing[] = [
    {
      id: "1",
      title: "Arlington Hall",
      address: "Arlington, TX",
      price: 800,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 650,
      imageUrl: "/Assets/Arlington_Hall.png",
      amenities: ["Wi-Fi", "Fitness Center", "Pool"],
      rating: 4.5,
      place: "Residence Hall"
    },
    {
      id: "2",
      title: "KC Hall",
      address: "Arlington, TX",
      price: 900,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 700,
      imageUrl: "/Assets/KC_Hall.png",
      amenities: ["Parking", "Study Rooms", "Laundry"],
      rating: 4.2,
      place: "Residence Hall"
    },
    {
      id: "4",
      title: "Vandergriff Hall",
      address: "Arlington, TX",
      price: 850,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 600,
      imageUrl: "/Assets/Vandergriff_Hall.png",
      amenities: ["Shuttle Service", "Utilities Included", "Furnished"],
      rating: 4.3,
      place: "Residence Hall"
    },
    {
      id: "5",
      title: "West Hall",
      address: "Arlington, TX",
      price: 700,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 550,
      imageUrl: "/Assets/West_Hall.png",
      amenities: ["On-Campus", "Meal Plan", "24/7 Support"],
      rating: 4.1,
      place: "Residence Hall"
    },
    {
      id: "6",
      title: "Arbor Oaks",
      address: "Arlington, TX",
      price: 720,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 600,
      imageUrl: "/Assets/Arbor_Oaks.jpeg",
      amenities: ["Study Lounge", "Community Events", "AC"],
      rating: 4.4,
      place: "Apartment"
    },
    {
      id: "7",
      title: "The Heights on Pecan",
      address: "Arlington, TX",
      price: 720,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 750,
      imageUrl: "/Assets/Height_At_Pecan.png",
      amenities: ["Study Lounge", "Community Events", "AC"],
      rating: 4.4,
      place: "Apartment"
    },
    {
      id: "8",
      title: "The Lofts",
      address: "Arlington, TX",
      price: 720,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 620,
      imageUrl: "/Assets/Loft.png",
      amenities: ["Study Lounge", "Community Events", "AC"],
      rating: 4.4,
      place: "Apartment"
    },
    {
      id: "9",
      title: "Meadow Run",
      address: "Arlington, TX",
      price: 720,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 800,
      imageUrl: "/Assets/Medow_Run.png",
      amenities: ["Study Lounge", "Community Events", "AC"],
      rating: 4.4,
      place: "Apartment"
    },
    {
      id: "10",
      title: "Timber Brook",
      address: "Arlington, TX",
      price: 720,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 750,
      imageUrl: "/Assets/Timber_Brook.png",
      amenities: ["Study Lounge", "Community Events", "AC"],
      rating: 4.4,
      place: "Apartment"
    },
    {
      id: "11",
      title: "University Village",
      address: "Arlington, TX",
      price: 720,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 600,
      imageUrl: "/Assets/University_Village.png",
      amenities: ["Study Lounge", "Community Events", "AC"],
      rating: 4.4,
      place: "Apartment"
    },
    {
      id: "12",
      title: "Centennial Court (Privately Owned)",
      address: "Arlington, TX",
      price: 720,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 850,
      imageUrl: "/Assets/Centennial.jpg",
      amenities: ["Study Lounge", "Community Events", "AC"],
      rating: 4.4,
      place: "Apartment"
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