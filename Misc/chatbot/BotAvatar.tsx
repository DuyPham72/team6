
import { Building2 } from "lucide-react";

interface BotAvatarProps {
  size?: "sm" | "md" | "lg";
}

export const BotAvatar = ({ size = "md" }: BotAvatarProps) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div className={`${sizes[size]} flex items-center justify-center rounded-full bg-gradient-to-b from-violet-500 to-purple-800`}>
      <Building2 
        className="text-white" 
        size={size === "sm" ? 12 : size === "md" ? 16 : 24} 
      />
    </div>
  );
};
