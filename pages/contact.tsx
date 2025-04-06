import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone, Send, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { useToast } from "./components/ui/ToastContext";
import Navbar from "./components/Navbar";
import { cn } from "@/lib/utils";

const ContactPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { showToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      showToast("Message sent successfully!", "success");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      showToast("Failed to send message. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      <Navbar setIsMenuOpen={setIsMenuOpen} />
      
      <div className={`relative z-10 px-6 sm:px-8 lg:px-16 pt-24 pb-16 transition-all duration-300 ${
        isMenuOpen ? "blur-lg pointer-events-none" : "blur-0"
      }`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-white/90 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <MessageSquare className="w-4 h-4" />
              Get in Touch
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400">
                Contact Us
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/80 max-w-2xl mx-auto"
            >
              Have questions or need assistance? We're here to help!
            </motion.p>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  Subject
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none transition-all"
                  required
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className={cn(
                    "px-6 py-3 flex items-center justify-center gap-2",
                    "bg-gradient-to-r from-violet-600 to-fuchsia-600",
                    "hover:from-violet-500 hover:to-fuchsia-500",
                    "text-white rounded-xl transition-all",
                    "shadow-lg shadow-violet-500/20"
                  )}
                >
                  <Send size={18} />
                  <span>Send Message</span>
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-white font-medium">Email</h3>
              </div>
              <p className="text-white/60">support@mavpads.com</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-white font-medium">Phone</h3>
              </div>
              <p className="text-white/60">(817) 555-1234</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-white font-medium">Live Chat</h3>
              </div>
              <p className="text-white/60">Available 24/7</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage; 