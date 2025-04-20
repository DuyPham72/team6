import { cn } from "@/lib/utils";

interface BotAvatarProps {
  size?: "default" | "sm";
}

export const BotAvatar = ({ size = "default" }: BotAvatarProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gray-100 border border-gray-200",
        size === "default" ? "w-8 h-8" : "w-6 h-6"
      )}
    >
      <div className="flex items-center justify-center w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "text-gray-700",
            size === "default" ? "w-5 h-5" : "w-3.5 h-3.5"
          )}
        >
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
      </div>
    </div>
  );
};