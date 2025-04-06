import { User } from "lucide-react";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg";
}

export const UserAvatar = ({ size = "md" }: UserAvatarProps) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div className={`${sizes[size]} flex items-center justify-center rounded-full bg-black border border-violet-500`}>
      <User 
        className="text-white" 
        size={size === "sm" ? 12 : size === "md" ? 16 : 20} 
      />
    </div>
  );
};