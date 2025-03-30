import { cn } from "../../../lib/utils";

interface UserAvatarProps {
  size?: "default" | "sm";
}

export const UserAvatar = ({ size = "default" }: UserAvatarProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gray-700",
        size === "default" ? "w-8 h-8" : "w-6 h-6"
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "text-white",
          size === "default" ? "w-4 h-4" : "w-3 h-3"
        )}
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
};
