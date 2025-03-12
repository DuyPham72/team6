import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  description: string;
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
}

const TeamMember = ({ name, role, image, description, socials }: TeamMemberProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
  const profileVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      } 
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const socialVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: (custom: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.1 * custom,
        duration: 0.3,
        ease: "backOut"
      }
    })
  };

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      whileHover="hover"
      variants={profileVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-violet-500/30 transition-all duration-300 shadow-lg hover:shadow-violet-600/20">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative w-24 h-24 mb-6 overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 p-0.5">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm group-hover:bg-black/10 transition-all duration-300"></div>
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          
          {/* Details */}
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          <p className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-3">{role}</p>
          <p className="text-white/70 text-center text-sm mb-5 leading-relaxed">{description}</p>
          
          {/* Social Icons */}
          <div className="flex space-x-3 mt-2">
            {socials?.linkedin && (
              <motion.a
                href={socials.linkedin}
                custom={1}
                variants={socialVariants}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={16} />
              </motion.a>
            )}
            
            {socials?.github && (
              <motion.a
                href={socials.github}
                custom={2}
                variants={socialVariants}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} />
              </motion.a>
            )}
            
            {socials?.twitter && (
              <motion.a
                href={socials.twitter}
                custom={3}
                variants={socialVariants}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={16} />
              </motion.a>
            )}
            
            {socials?.instagram && (
              <motion.a
                href={socials.instagram}
                custom={4}
                variants={socialVariants}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={16} />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Example usage in a team section component
export const TeamSection = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Lead Developer",
      image: "/Assets/team1.jpg", // Update with actual path
      description: "Full-stack developer with expertise in React and Node.js, passionate about creating accessible user interfaces.",
      socials: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        twitter: "https://twitter.com"
      }
    },
    {
      name: "Samantha Lee",
      role: "UX Designer",
      image: "/Assets/team2.jpg", // Update with actual path
      description: "Creative designer focused on user-centered design principles and creating delightful experiences.",
      socials: {
        linkedin: "https://linkedin.com",
        instagram: "https://instagram.com"
      }
    },
    {
      name: "Marcus Chen",
      role: "Backend Engineer",
      image: "/Assets/team3.jpg", // Update with actual path
      description: "Database expert specializing in optimizing performance and building scalable architectures.",
      socials: {
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      }
    }
  ];
  
  return (
    <section className="py-24 relative bg-gradient-to-b from-violet-900/70 to-black text-white overflow-hidden">
      {/* Background gradient decorations */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-fuchsia-600/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-fuchsia-300"
        >
          Meet Our Team
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/70 text-center max-w-2xl mx-auto mb-16"
        >
          Our talented team of developers and designers working to create the best housing platform for UTA students.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember 
              key={index}
              name={member.name}
              role={member.role}
              image={member.image}
              description={member.description}
              socials={member.socials}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMember;