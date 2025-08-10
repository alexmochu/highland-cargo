'use client';

import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { forwardRef } from "react";

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export const HoverCardContent = forwardRef(({ className, ...props }, ref) => {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align="center"
        sideOffset={8}
        className={cn("z-50 w-72 bg-white border border-gray-200 shadow-xl rounded-lg p-4", className)}
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {props.children}
        </motion.div>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
});
HoverCardContent.displayName = "HoverCardContent";

