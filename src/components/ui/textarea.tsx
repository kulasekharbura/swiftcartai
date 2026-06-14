import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-[#D5D9D9] bg-white px-4 py-3 text-sm text-[#131A22] placeholder:text-[#565959] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]/20 focus-visible:border-[#FF9900] disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
