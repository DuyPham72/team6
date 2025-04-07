import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export const Button: React.FC<ButtonProps> = ({ variant = "primary", className, ...props }) => {
    function cn(...classes: (string | undefined)[]): string {
        return classes.filter(Boolean).join(" ");
    }
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-colors",
        variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-black hover:bg-gray-300",
        className
      )}
      {...props}
    />
  );
};
