import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#FFD814] text-[#131A22] hover:bg-[#F7CA00] active:bg-[#F2C200]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-[#D5D9D9] bg-white hover:bg-[#F7F8FA] text-[#131A22]",
        secondary: "bg-[#F7F8FA] text-[#131A22] hover:bg-gray-200 border border-[#D5D9D9]",
        ghost: "hover:bg-[#F7F8FA] text-[#565959]",
        link: "text-[#007185] underline-offset-4 hover:text-[#C7511F] hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
