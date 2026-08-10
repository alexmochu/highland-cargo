"use client";

import * as React from "react";
import { 
    Dialog as RadixDialog, 
    DialogContent as RadixDialogContent,
    DialogTitle as RadixDialogTitle,
 } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils"; // Adjust this if you don’t have a cn util

export const Dialog = RadixDialog;

export const DialogContent = ({ className, children, ...props }) => (
  <RadixDialogContent className={cn("relative bg-surface border border-line p-6 shadow-lg overflow-hidden", className)} {...props}>
    <div className="absolute inset-x-0 top-0 h-[3px] bg-beacon" />
    {children}
  </RadixDialogContent>
);

export const DialogHeader = ({ className, children }) => (
  <div className={cn("mb-5 flex flex-col space-y-1.5 text-left border-b border-line pb-4", className)}>
    {children}
  </div>
);

export const DialogTitle = ({ className, children }) => (
  <RadixDialogTitle className={cn("font-display font-extrabold text-xl leading-none tracking-tight", className)}>
    {children}
  </RadixDialogTitle>
);

export const DialogFooter = ({ className, children }) => (
  <div className={cn("mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}>
    {children}
  </div>
);
