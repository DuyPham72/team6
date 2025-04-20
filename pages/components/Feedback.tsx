import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, X } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface FeedbackFormProps {
  apartmentName: string;
  apartmentId: number;
  onClose: () => void;
}

const Feedback: React.FC<FeedbackFormProps> = ({
  apartmentName,
  apartmentId,
  onClose,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    type: 'price',
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
      toast.warning("Please sign in to submit feedback");
      return;
    }
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartmentId,
          apartmentName,
          ...formData,
          userId: user.id,
          userName: formData.isAnonymous ? 'Anonymous' : `${user.firstName} ${user.lastName}`,
          userEmail: user.emailAddresses[0].emailAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast.success("Feedback submitted successfully!");
      handleClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  const handleClose = () => {
    router.push('/');
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
      >
        <motion.div 
          className="relative max-w-md w-full bg-gradient-to-b from-black/90 to-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-fuchsia-600/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          {/* Header */}
          <div className="relative pt-6 px-6 pb-4 border-b border-white/10 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">Update Housing Information</h2>
              <p className="text-white/60 text-sm mt-1">
                Help us keep our listings accurate
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 relative">
            <div className="mb-6 bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Info size={16} />
                <span className="text-sm font-medium">About {apartmentName}</span>
              </div>
              <p className="text-white/70 text-sm">
                Submitting accurate updates helps future students find the right housing option.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  What needs to be updated?
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none"
                  required
                >
                  <option value="price" className="bg-zinc-800">Price Change</option>
                  <option value="location" className="bg-zinc-800">Location Information</option>
                  <option value="amenities" className="bg-zinc-800">Amenities Update</option>
                  <option value="contact" className="bg-zinc-800">Contact Information</option>
                  <option value="other" className="bg-zinc-800">Other Information</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  {formData.type === 'price' && 'New Price Information'}
                  {formData.type === 'location' && 'Location Details'}
                  {formData.type === 'amenities' && 'Amenities Changes'}
                  {formData.type === 'contact' && 'New Contact Details'}
                  {formData.type === 'other' && 'Information Details'}
                </label>
                <input
                  type="text"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder={
                    formData.type === 'price'
                      ? 'e.g., $850/month instead of $800/month'
                      : formData.type === 'location'
                      ? 'e.g., Correct address or directions'
                      : formData.type === 'amenities'
                      ? 'e.g., New gym equipment, pool is closed'
                      : formData.type === 'contact'
                      ? 'e.g., New phone number or email'
                      : 'Provide details about what needs updating'
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
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleClose}
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
    </AnimatePresence>
  );
};
export default Feedback;
