import { motion } from "framer-motion";
import { useRef } from "react";
import TeamMember from "./TeamMember";

interface TeamMemberData {
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

const TeamSection = () => {
  const teamRef = useRef<HTMLDivElement>(null);
  
  // Team members data
  const teamMembers: TeamMemberData[] = [
    {
      name: "Alex Johnson",
      role: "Project Manager",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop",
      description: "Alex expertly coordinates project execution and ensures all services meet the highest standards.",
      socials: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    },
    {
      name: "Bob Smith",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
      description: "Bob writes clean, efficient code that powers our easy-to-use application experience.",
      socials: {
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      }
    },
    {
      name: "Cathy Lee",
      role: "UX Designer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
      description: "Cathy designs intuitive interfaces that enhance your experience using MavPads.",
      socials: {
        linkedin: "https://linkedin.com",
        instagram: "https://instagram.com"
      }
    },
    {
      name: "David Kim",
      role: "Marketing Specialist",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
      description: "David drives our marketing strategies to connect with users and increase our platform.",
      socials: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    },
    {
      name: "Emma Brown",
      role: "Content Writer",
      image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=1000&auto=format&fit=crop",
      description: "Emma creates valuable content that informs and inspires our community of users.",
      socials: {
        linkedin: "https://linkedin.com",
        instagram: "https://instagram.com"
      }
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section 
      id="team"
      ref={teamRef}
      className="py-24 relative bg-gradient-to-b from-black to-violet-900/70 text-white overflow-hidden"
    >
      {/* Background gradient decorations */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-violet-600/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-fuchsia-600/20 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-fuchsia-300">Our Team</h2>
          <p className="text-white/70 max-w-2xl mx-auto">Dedicated professionals committed to revolutionizing your housing experience at UTA.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"
        >
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
        </motion.div>
      </div>
      
      {/* Bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </section>
  );
};

export default TeamSection;