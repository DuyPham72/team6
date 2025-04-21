
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

// Check if message is asking to see listings with specific criteria
const isHousingSearchQuery = (message: string): boolean => {
  const searchPatterns = [
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
  ];
  
  return searchPatterns.some(pattern => pattern.test(message));
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
  // Check if it's a housing search query
  if (isHousingSearchQuery(message)) {
    const priceMatch = message.match(/\$?(\d+)/);
    const placeMatch = message.match(/(apartment|residence hall|dorm|house)/i);
    
    const queryParams = new URLSearchParams();
    
    if (priceMatch) {
      queryParams.append('maxPrice', priceMatch[1]);
    }
    
    if (placeMatch) {
      const placeType = placeMatch[1].toLowerCase();
      if (placeType === 'apartment') {
        queryParams.append('placeType', 'Apartment');
      } else if (placeType === 'residence hall' || placeType === 'dorm') {
        queryParams.append('placeType', 'Residence Hall');
      }
    }
    
    const queryString = queryParams.toString();
    const redirectUrl = `/components/explore${queryString ? `?${queryString}` : ''}`;
    
    return {
      type: 'redirect',
      content: `I'll help you find housing options${priceMatch ? ` under $${priceMatch[1]}` : ''}${placeMatch ? ` that are ${placeMatch[1]}s` : ''}.`,
      url: redirectUrl
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