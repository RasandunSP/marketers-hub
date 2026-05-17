"use client";

import { Toaster as Sonner } from "sonner";
import { cn } from "@/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/** shadcn/ui Sonner toaster — top-right, compact dark pills */
function Toaster({ className, ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      duration={2800}
      closeButton={false}
      visibleToasts={4}
      offset={16}
      className={cn("toaster group", className)}
      toastOptions={{
        classNames: {
          toast: cn(
            "group toast !rounded-lg !border !border-neutral-700 !bg-neutral-900 !text-white",
            "!px-3.5 !py-2 !shadow-lg !gap-2 !min-h-0 !w-auto !max-w-[min(100vw-2rem,20rem)]",
          ),
          title: "!text-[13px] !font-medium !leading-snug !text-white",
          description: "!text-neutral-400",
          icon: "!size-4 !shrink-0 !text-[15px]",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
