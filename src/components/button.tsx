import { cn } from "@/lib/utils";
import Link from "next/link";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";

  isLoading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",

      isLoading,
      href,
      target,
      rel,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center cursor-pointer justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";

    const variants = {
      default: "bg-primary-green text-primary-gray hover:bg-lime-300",
      outline:
        "border border-white text-white hover:bg-white hover:text-primary-gray",
      ghost: "bg-transparent hover:text-primary-gray hover:bg-white",
      link: "bg-transparent underline-offset-4 hover:underline text-white hover:text-primary-gray",
    };

    const styles = cn(baseStyles, variants[variant], className);

    if (href) {
      return (
        <Link href={href} className={styles} target={target} rel={rel}>
          {isLoading ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-md border-2 border-current border-t-transparent" />
          ) : null}
          {children}
        </Link>
      );
    }

    return (
      <button className={styles} ref={ref} {...props}>
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-md border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
