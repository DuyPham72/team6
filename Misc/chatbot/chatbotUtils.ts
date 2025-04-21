// Simple response generator based on keywords
// In a real application, this would be connected to an actual AI service

type ResponseCategory = {
  keywords: string[];
  responses: string[];
};

export type ChatbotResponse = {
  type: 'message' | 'redirect';
  content: string;
  url?: string;
};

export type HousingQueryAction = {
  type: "redirect";
  url: string;
};

const responseCategories: ResponseCategory[] = [
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    responses: [
      "Hello! How can I help you with your housing needs today?",
      "Hi there! Looking for housing assistance?",
      "Hey! I'm here to help with any housing questions you might have.",
    ],
  },
  {
    keywords: ["apartment", "apartments", "flat", "rent", "rental"],
    responses: [
      "We have several apartment options available. Are you looking for a specific area or price range?",
      "Our rental listings are updated daily. What size apartment are you interested in?",
      "Apartments in high-demand areas tend to go quickly. Would you like me to show you our featured rentals?",
    ],
  },
  {
    keywords: ["price", "cost", "expensive", "cheap", "affordable", "budget"],
    responses: [
      "Our housing options range from affordable to luxury. What's your budget range?",
      "We have properties to fit most budgets. Are you looking for something specific?",
      "Prices vary by location, size, and amenities. Would you like me to show you options within a specific budget range?",
    ],
  },
  {
    keywords: ["location", "area", "neighborhood", "close", "near"],
    responses: [
      "Location is key! We have properties in several desirable neighborhoods. Any specific area you're interested in?",
      "We have housing options across various neighborhoods. Are you looking to be close to any particular location?",
      "Our properties are located in both urban and suburban settings. Do you have a preference?",
    ],
  },
  {
    keywords: ["amenities", "feature", "features", "pool", "gym", "parking"],
    responses: [
      "Many of our properties offer amenities like pools, gyms, and covered parking. Any specific features you're looking for?",
      "Amenities can make a big difference! Would you like me to filter properties by specific amenities?",
      "From in-unit laundry to community spaces, we have properties with various amenities. What's most important to you?",
    ],
  },
  {
    keywords: ["application", "apply", "qualification", "qualify", "requirements"],
    responses: [
      "Our application process is simple. You'll need proof of income, identification, and references. Would you like more details?",
      "To apply, you'll generally need to show income of 3x the rent, provide ID, and pass a background check. Need help getting started?",
      "Applications can be completed online. The basic requirements include income verification and a credit check. Would you like me to guide you through the process?",
    ],
  },
  {
    keywords: ["pet", "pets", "dog", "cat", "animal"],
    responses: [
      "Many of our properties are pet-friendly! There may be certain restrictions or deposits required. Would you like to see pet-friendly options?",
      "We understand pets are family too! Would you like me to show you our pet-friendly properties?",
      "Pet policies vary by property. Some allow all pets, while others may have restrictions on size or breed. Would you like more information?",
    ],
  },
  {
    keywords: ["roommate", "roommates", "share", "sharing"],
    responses: [
      "Looking for a roommate situation? We can help connect you with roommate-seeking listings or shared housing options.",
      "Shared housing can be a great way to reduce costs. Would you like information on roommate-friendly properties or shared housing options?",
      "We have resources for those seeking roommates or room-for-rent situations. Would you like more details?",
    ],
  },
  {
    keywords: ["lease", "term", "contract", "agreement", "month-to-month"],
    responses: [
      "Our lease terms typically range from 6-12 months, though some properties offer month-to-month options. What length are you looking for?",
      "Lease flexibility varies by property. Some offer short-term leases while others require longer commitments. Any specific term you're interested in?",
      "Understanding lease terms is important! Would you like information on standard lease agreements or flexible options?",
    ],
  },
  {
    keywords: ["student", "college", "university", "campus"],
    responses: [
      "We have several properties popular with students, especially near major campuses. Are you looking for student housing specifically?",
      "Student housing often has special lease terms aligned with academic calendars. Would that be helpful for you?",
      "Our student-friendly properties often include amenities like study spaces and easy transportation to campus. Would you like to see some options?",
    ],
  },
  {
    keywords: ["help", "assistance", "support", "question"],
    responses: [
      "I'm here to help! What specific housing questions can I assist you with today?",
      "I'd be happy to provide support with your housing search. What information are you looking for?",
      "How can I assist you with your housing needs today? Just let me know what you're looking for!",
    ],
  },
  {
    keywords: ["residence hall", "dorm", "dormitory"],
    responses: [
      "Our residence halls offer convenient on-campus living. Would you like to see the available options?",
      "Residence halls are a great way to be part of the campus community. Are you interested in specific amenities?",
      "We have several residence hall options with different layouts and amenities. Would you like me to show you the options?",
    ],
  },
];

const fallbackResponses = [
  "I'm here to help with housing, but I didn’t understand that. Could you ask something like 'show me apartments under $1000'?",
];

// Define query types for better categorization
type QueryType = 
  | 'housing_search' 
  | 'residence_hall_info' 
  | 'amenity_info' 
  | 'cost_info' 
  | 'pet_policy' 
  | 'comparison' 
  | 'review_info' 
  | 'general_question';

// Define a more structured query pattern system
interface QueryPattern {
  type: QueryType;
  patterns: RegExp[];
  priority: number; // Higher priority patterns are checked first
}

const queryPatterns: QueryPattern[] = [
  {
    type: 'housing_search',
    priority: 1,
    patterns: [
      /show me .*(house|home|apartment|property|rental|housing|residence hall|dorm)/i,
      /find .*(house|home|apartment|property|rental|housing|residence hall|dorm)/i,
      /.*(house|home|apartment|property|rental|housing|residence hall|dorm).*under.?\$?\d+/i,
      /.*(house|home|apartment|property|rental|housing|residence hall|dorm).*\$\d+/i,
      /.*(house|home|apartment|property|rental|housing|residence hall|dorm).*\d+ bed/i,
      /.*(available|affordable).*(house|home|apartment|property|rental|housing|residence hall|dorm)/i,
      /\d+ bedroom.*(house|home|apartment|property|rental|housing|residence hall|dorm)/i,
      /looking for.*(house|home|apartment|property|rental|housing|residence hall|dorm)/i,
      /need.*(house|home|apartment|property|rental|housing|residence hall|dorm)/i,
      /want.*(house|home|apartment|property|rental|housing|residence hall|dorm)/i,
      /.*under.?\$?\d+/i,
      /.*\$\d+/i,
      /.*\d+ per month/i,
      /.*\d+ a month/i,
      /.*with (pool|gym|parking|laundry|washer|dryer|dishwasher|balcony|patio|garage|storage)/i,
      /.*has (pool|gym|parking|laundry|washer|dryer|dishwasher|balcony|patio|garage|storage)/i,
      /.*featuring (pool|gym|parking|laundry|washer|dryer|dishwasher|balcony|patio|garage|storage)/i,
      /.*that has (pool|gym|parking|laundry|washer|dryer|dishwasher|balcony|patio|garage|storage)/i,
      /.*with a (pool|gym|parking|laundry|washer|dryer|dishwasher|balcony|patio|garage|storage)/i,
      /.*best reviews/i,
      /.*good reviews/i,
      /.*highest rated/i,
      /.*top rated/i,
      /.*highly rated/i,
      /.*with.*reviews/i,
    ]
  },
  {
    type: 'residence_hall_info',
    priority: 2,
    patterns: [
      /tell me about (residence hall|dorm|dormitory)/i,
      /what.*(residence hall|dorm|dormitory)/i,
      /.*(residence hall|dorm|dormitory).*amenities/i,
      /.*(residence hall|dorm|dormitory).*cost/i,
      /.*(residence hall|dorm|dormitory).*price/i,
      /.*(residence hall|dorm|dormitory).*pet/i,
      /.*(residence hall|dorm|dormitory).*room/i,
      /.*(residence hall|dorm|dormitory).*meal/i,
      /.*(residence hall|dorm|dormitory).*plan/i,
    ]
  },
  {
    type: 'amenity_info',
    priority: 2,
    patterns: [
      /what amenities/i,
      /.*amenities.*have/i,
      /.*features.*have/i,
      /.*include.*(pool|gym|parking|laundry|washer|dryer|dishwasher|balcony|patio|garage|storage)/i,
      /.*offer.*(pool|gym|parking|laundry|washer|dryer|dishwasher|balcony|patio|garage|storage)/i,
      /.*provide.*(pool|gym|parking|laundry|washer|dryer|dishwasher|balcony|patio|garage|storage)/i,
    ]
  },
  {
    type: 'cost_info',
    priority: 2,
    patterns: [
      /how much.*cost/i,
      /how much.*price/i,
      /what.*cost/i,
      /what.*price/i,
      /.*budget/i,
      /.*affordable/i,
      /.*expensive/i,
      /.*cheap/i,
      /.*cost range/i,
      /.*price range/i,
    ]
  },
  {
    type: 'pet_policy',
    priority: 2,
    patterns: [
      /.*pet friendly/i,
      /.*allow pets/i,
      /.*accept pets/i,
      /.*pet policy/i,
      /.*pet deposit/i,
      /.*pet fee/i,
      /.*pet rent/i,
      /.*dog/i,
      /.*cat/i,
      /do.*(apartment|house|home|property|rental|housing|residence hall|dorm).*allow pets/i,
      /do.*(apartment|house|home|property|rental|housing|residence hall|dorm).*accept pets/i,
      /do.*(apartment|house|home|property|rental|housing|residence hall|dorm).*pet friendly/i,
      /.*(apartment|house|home|property|rental|housing|residence hall|dorm).*pet/i,
      /.*pet.*(apartment|house|home|property|rental|housing|residence hall|dorm)/i,
    ]
  },
  {
    type: 'comparison',
    priority: 3,
    patterns: [
      /.*comparing.*(apartment|house|home|property|rental|housing)/i,
      /.*compare.*(apartment|house|home|property|rental|housing)/i,
      /.*comparison.*(apartment|house|home|property|rental|housing)/i,
      /.*see.*comparison/i,
      /.*show.*comparison/i,
      /.*view.*comparison/i,
      /.*compare.*options/i,
      /.*compare.*places/i,
      /.*compare.*properties/i,
    ]
  },
  {
    type: 'review_info',
    priority: 2,
    patterns: [
      /.*best reviews/i,
      /.*good reviews/i,
      /.*highest rated/i,
      /.*top rated/i,
      /.*highly rated/i,
      /.*with.*reviews/i,
      /.*rating/i,
      /.*stars/i,
      /.*feedback/i,
      /.*testimonials/i,
      /which.*best/i,
      /which.*good/i,
      /which.*highest/i,
      /which.*top/i,
      /which.*highly/i,
      /which.*rated/i,
      /which.*reviews/i,
      /which.*feedback/i,
      /which.*testimonials/i,
      /which.*stars/i,
    ]
  },
  {
    type: 'general_question',
    priority: 4,
    patterns: [
      /.*how do i/i,
      /.*what is/i,
      /.*what are/i,
      /.*when can/i,
      /.*where is/i,
      /.*why is/i,
      /.*can i/i,
      /.*do you/i,
      /.*help me/i,
      /.*explain/i,
    ]
  }
];

// Enhanced function to determine query type
const determineQueryType = (message: string): QueryType | null => {
  // Sort patterns by priority (higher priority first)
  const sortedPatterns = [...queryPatterns].sort((a, b) => b.priority - a.priority);
  
  for (const queryPattern of sortedPatterns) {
    if (queryPattern.patterns.some(pattern => pattern.test(message))) {
      return queryPattern.type;
    }
  }
  
  return null;
};

// Check if message is asking to see listings with specific criteria
const isHousingSearchQuery = (message: string): boolean => {
  const queryType = determineQueryType(message);
  return queryType === 'housing_search';
};

// Extract query parameters for more targeted responses
const extractQueryParameters = (message: string): Record<string, any> => {
  const params: Record<string, any> = {};
  
  // Extract price information
  const priceMatch = message.match(/\$?(\d+)(?:\s*(?:per|a)\s*month)?/i);
  if (priceMatch) {
    params.maxPrice = parseInt(priceMatch[1]);
  }
  
  // Extract housing type
  const housingTypeMatch = message.match(/(apartment|house|home|property|rental|housing|residence hall|dorm)/i);
  if (housingTypeMatch) {
    params.housingType = housingTypeMatch[1].toLowerCase();
  }
  
  // Extract amenities
  const amenityMatch = message.match(/(pool|gym|parking|laundry|washer|dryer|dishwasher|balcony|patio|garage|storage)/i);
  if (amenityMatch) {
    params.amenity = amenityMatch[1].toLowerCase();
  }
  
  // Extract bedroom count
  const bedroomMatch = message.match(/(\d+)\s*(?:bed|bedroom|br)/i);
  if (bedroomMatch) {
    params.bedrooms = parseInt(bedroomMatch[1]);
  }
  
  // Extract review criteria
  if (message.match(/(best|good|highest|top|highly)\s*rated/i) || 
      message.match(/(best|good)\s*reviews/i)) {
    params.reviewCriteria = 'high';
  }
  
  return params;
};

const keywordResponses: Record<string, string> = {
  "hello|hi|hey": "Hello! How can I help you find housing today?",
  "help|assist": "I can help you find housing options based on price, location, and type. Just ask me something like 'show me apartments under $800' or 'find me a residence hall'.",
  "thanks|thank you": "You're welcome! Let me know if you need anything else.",
  "bye|goodbye": "Goodbye! Feel free to come back if you need more help finding housing."
};

// Check if the user input is too short or nonsensical
const isNonsenseInput = (text: string): boolean => {
  const cleaned = text.trim().replace(/[^a-zA-Z0-9\s]/g, "");
  if (cleaned.length === 0) return true;
  if (cleaned.split(/\s+/).length <= 2 && cleaned.length < 10) return true;
  return false;
};

export const processUserMessage = (message: string): ChatbotResponse => {
  // Determine query type for more targeted responses
  const queryType = determineQueryType(message);
  
  // Handle review queries specifically
  if (queryType === 'review_info') {
    return {
      type: 'redirect',
      content: "I'll show you housing options with the best reviews. You can sort by rating on the explore page.",
      url: '/components/explore?sortBy=rating'
    };
  }
  
  // Handle pet policy queries specifically
  if (queryType === 'pet_policy') {
    return {
      type: 'redirect',
      content: "I'll show you housing options with pet policies. You can filter for pet-friendly properties on the explore page.",
      url: '/components/explore?amenity=pet-friendly'
    };
  }
  
  // Check if it's a housing search query
  if (isHousingSearchQuery(message)) {
    const params = extractQueryParameters(message);
    const queryParams = new URLSearchParams();
    
    if (params.maxPrice) {
      queryParams.append('maxPrice', params.maxPrice.toString());
    }
    
    if (params.housingType) {
      queryParams.append('placeType', params.housingType);
    }
    
    if (params.amenity) {
      queryParams.append('amenity', params.amenity);
    }
    
    if (params.bedrooms) {
      queryParams.append('bedrooms', params.bedrooms.toString());
    }
    
    if (params.reviewCriteria) {
      queryParams.append('reviewCriteria', params.reviewCriteria);
    }
    
    const queryString = queryParams.toString();
    const redirectUrl = `/components/explore${queryString ? `?${queryString}` : ''}`;
    
    return {
      type: 'redirect',
      content: `I'll help you find housing options${params.maxPrice ? ` under $${params.maxPrice}` : ''}${params.housingType ? ` that are ${params.housingType}s` : ''}${params.amenity ? ` with a ${params.amenity}` : ''}${params.bedrooms ? ` with ${params.bedrooms} bedroom${params.bedrooms > 1 ? 's' : ''}` : ''}${params.reviewCriteria ? ' with good reviews' : ''}.`,
      url: redirectUrl
    };
  }

  if (queryType === 'residence_hall_info') {
    return {
      type: 'redirect',
      content: "I'll show you information about our residence halls.",
      url: '/components/explore?placeType=Residence Hall'
    };
  }
  
  if (queryType === 'comparison') {
    return {
      type: 'redirect',
      content: "I'll take you to the comparison page where you can compare different housing options.",
      url: '/components/explore?view=comparison'
    };
  }

  // Check for keywords in the message
  const lowerMessage = message.toLowerCase();
  for (const [keywords, response] of Object.entries(keywordResponses)) {
    if (keywords.split("|").some((keyword) => lowerMessage.includes(keyword))) {
      return { type: 'message', content: response };
    }
  }

  // Handle invalid/nonsense input
  if (isNonsenseInput(message)) {
    return {
      type: 'message',
      content: "Hmm, I didn't quite catch that. Try asking something like 'find me an apartment under $1000' or 'do you allow pets?'"
    };
  }

  // No match found, but message seems valid — return helpful fallback
  return { 
    type: 'message', 
    content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)] 
  };
};