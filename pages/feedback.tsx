import { motion } from "framer-motion";
import { Check, Info, MessageSquare, X, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { useToast } from "./components/ui/ToastContext";
import Navbar from "./components/Navbar";
import { cn } from "@/lib/utils";

const FeedbackPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { showToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'suggestion',
    details: '',
    additionalInfo: '',
    isAnonymous: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast("Please sign in to submit feedback", "warning");
      return;
    }
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          userName: formData.isAnonymous ? 'Anonymous' : `${user.firstName} ${user.lastName}`,
          userEmail: user.emailAddresses[0].emailAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      showToast("Thank you for your feedback!", "success");
      router.push('/');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast("Failed to submit feedback. Please try again.", "error");
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
              Share Your Thoughts
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400">
                Feedback & Suggestions
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/80 max-w-2xl mx-auto"
            >
              Help us improve MavPads by sharing your experience and suggestions
            </motion.p>
          </div>

          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-6 bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Info size={16} />
                  <span className="text-sm font-medium">About MavPads</span>
                </div>
                <p className="text-white/70 text-sm">
                  Your feedback helps us improve the platform for all students.
                </p>
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  Feedback Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none"
                  required
                >
                  <option value="suggestion" className="bg-zinc-800">Suggestion</option>
                  <option value="bug" className="bg-zinc-800">Bug Report</option>
                  <option value="feature" className="bg-zinc-800">Feature Request</option>
                  <option value="other" className="bg-zinc-800">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  {formData.type === 'suggestion' && 'Your Suggestion'}
                  {formData.type === 'bug' && 'Bug Description'}
                  {formData.type === 'feature' && 'Feature Description'}
                  {formData.type === 'other' && 'Your Feedback'}
                </label>
                <input
                  type="text"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder={
                    formData.type === 'suggestion'
                      ? 'What would you like to suggest?'
                      : formData.type === 'bug'
                      ? 'Describe the issue you encountered'
                      : formData.type === 'feature'
                      ? 'Describe the feature you would like to see'
                      : 'Share your thoughts with us'
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  Additional Information <span className="text-white/40">(optional)</span>
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Any other details that might be helpful..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-violet-500 focus:ring-violet-500/50"
                />
                <label htmlFor="isAnonymous" className="text-white/80 text-sm">
                  Submit anonymously
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className={cn(
                    "px-5 py-2.5 flex items-center justify-center gap-2",
                    "bg-gradient-to-r from-violet-600 to-fuchsia-600",
                    "hover:from-violet-500 hover:to-fuchsia-500",
                    "text-white rounded-xl transition-all",
                    "shadow-lg shadow-violet-500/20"
                  )}
                >
                  <Check size={18} />
                  <span>Submit Feedback</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPage; 