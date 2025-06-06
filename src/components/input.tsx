import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  variant?: "default" | "dark";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, variant = "default", ...props }, ref) => {
    const baseStyles =
      "appearance-none relative block w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:z-10 sm:text-sm lg:text-base";

    const variants = {
      default:
        "border-gray-300 placeholder-gray-500 text-gray-100 focus:ring-primary-green focus:border-primary-green",
      dark: "bg-forth-gray border-forth-gray text-gray-100 placeholder-gray-400 focus:ring-primary-green focus:border-primary-green rounded-md",
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="sr-only">
            {label}
          </label>
        )}
        <input
          className={cn(
            baseStyles,
            variants[variant],
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
