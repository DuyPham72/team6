import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import TeamSection from "./components/TeamSection";
import TestimonialsSection from "./components/TestimonialsSection";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = "/Assets/uta_housing.jpeg";
  }, []);

  return (
    <div className="relative w-full bg-white overflow-x-hidden">
      <Navbar setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      <TestimonialsSection />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default Index;