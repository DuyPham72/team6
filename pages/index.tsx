import { lazy, Suspense, useEffect, useState } from "react";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import TestimonialsSection from "./components/TestimonialsSection";

// Lazy load the Chatbot to improve initial page load performance
const Chatbot = lazy(() => import("./components/chatbot/Chatbot"));

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatbotLoaded, setChatbotLoaded] = useState(false);
  
  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = "/Assets/uta_housing.jpeg";
  }, []);

  // Load chatbot after a slight delay for better perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setChatbotLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full bg-white overflow-x-hidden">
      <Navbar setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      <TestimonialsSection />
      {/* <TeamSection /> */}
      <Footer />
      
      {/* Chatbot */}
      {chatbotLoaded && (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
