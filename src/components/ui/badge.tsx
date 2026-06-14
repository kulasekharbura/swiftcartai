import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#FFF4E0] text-[#C7511F] border-[#FF9900]/30",
        secondary: "bg-[#F7F8FA] text-[#565959] border-[#D5D9D9]",
        success: "bg-[#E7F7E7] text-[#067D62] border-[#067D62]/20",
        destructive: "bg-red-50 text-red-700 border-red-200",
        outline: "text-[#131A22] border-[#D5D9D9]",
        ai: "bg-[#E8F4FD] text-[#007185] border-[#007185]/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
