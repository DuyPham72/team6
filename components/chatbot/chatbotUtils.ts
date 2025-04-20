import { parseHousingQuery } from "../../lib/services/housingService";

// Simple response generator based on keywords
// In a real application, this would be connected to an actual AI service

type ResponseCategory = {
  keywords: string[];
  responses: string[];
};

export type ChatbotResponse = string | HousingQueryAction;

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
  "I'm not sure I understand completely. Could you tell me more about what you're looking for in housing?",
  "I'd like to help! Could you provide more details about your housing needs?",
  "I want to make sure I assist you properly. Could you elaborate on what you're looking for?",
  "Thank you for your message. To better help you, could you share more specific details about your housing requirements?",
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

export const processUserMessage = async (message: string): Promise<ChatbotResponse> => {
  const lowerMessage = message.toLowerCase();
  
  // Check if this is a housing search query
  if (isHousingSearchQuery(message)) {
    // Parse the query to extract parameters
    const params = parseHousingQuery(message);
    
    // Build the URL with query parameters
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    // Return a redirect action
    return {
      type: "redirect",
      url: `/explore?${queryString}`,
    };
  }
  
  // Check for matches in response categories
  for (const category of responseCategories) {
    if (category.keywords.some((keyword) => lowerMessage.includes(keyword))) {
      // Select a random response from the matching category
      const randomIndex = Math.floor(Math.random() * category.responses.length);
      return category.responses[randomIndex];
    }
  }
  
  // If no keyword matches, return a fallback response
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
};