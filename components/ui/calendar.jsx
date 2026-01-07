"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const Calendar = ({ className, classNames, ...props }) => {
  return (
    <DayPicker
      mode="month" // Enable month selection only
      className={cn("p-3", className)}
      classNames={{
        caption: "flex justify-between items-center p-2",
        caption_label: "text-sm font-medium",
        nav: "flex gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        table: "hidden", // Hide day table
        row: "hidden", // Hide day rows
        cell: "hidden", // Hide day cells
        day: "hidden", // Hide individual days
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
};

Calendar.displayName = "Calendar";

export { Calendar };
