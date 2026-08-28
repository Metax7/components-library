import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils";

/**
 * Customizable button component with variant and size options.
 * 
 * Renders a responsive button that supports:
 * - Four variants: primary, destructive, outline, ghost
 * - Three sizes: sm, md, lg
 * - Full React.ButtonHTMLAttributes support
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click Me</Button>
 * <Button variant="destructive">Delete Item</Button>
 * <Button variant="outline">Cancel</Button>
 * ```
 */

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900",
        ghost: "hover:bg-gray-100 text-gray-700",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "destructive" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * Forwarded button component.
 * 
 * @param props - Button props including className, variant, and size
 * @param ref - Ref to the underlying HTMLButtonElement
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
