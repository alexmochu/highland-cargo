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
  <RadixDialogContent className={cn("rounded-lg bg-white p-6 shadow-lg", className)} {...props}>
    {children}
  </RadixDialogContent>
);

export const DialogHeader = ({ className, children }) => (
  <div className={cn("mb-4 flex flex-col space-y-1.5 text-center", className)}>
    {children}
  </div>
);

export const DialogTitle = ({ className, children }) => (
  <RadixDialogTitle className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
    {children}
  </RadixDialogTitle>
);

export const DialogFooter = ({ className, children }) => (
  <div className={cn("mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}>
    {children}
  </div>
);
