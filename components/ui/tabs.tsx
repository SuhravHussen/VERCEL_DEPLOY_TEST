"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  const [tabPositions, setTabPositions] = React.useState<
    Record<string, { left: number; width: number }>
  >({});
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (listRef.current) {
      const tabs = listRef.current.querySelectorAll('[role="tab"]');
      const positions: Record<string, { left: number; width: number }> = {};

      tabs.forEach((tab) => {
        const tabElement = tab as HTMLElement;
        const tabValue =
          tabElement.getAttribute("data-value") || tabElement.textContent || "";
        const rect = tabElement.getBoundingClientRect();
        const listRect = listRef.current!.getBoundingClientRect();

        positions[tabValue] = {
          left: rect.left - listRect.left + 2, // Slight padding adjustment
          width: rect.width - 4, // Account for padding
        };
      });

      setTabPositions(positions);
    }
  }, [children]);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      if (listRef.current) {
        const activeTabElement = listRef.current.querySelector(
          '[data-state="active"]'
        );
        if (activeTabElement) {
          const value =
            activeTabElement.getAttribute("data-value") ||
            activeTabElement.textContent ||
            "";
          setActiveTab(value);
        }
      }
    });

    if (listRef.current) {
      observer.observe(listRef.current, {
        attributes: true,
        subtree: true,
        attributeFilter: ["data-state"],
      });

      // Set initial active tab
      const activeTabElement = listRef.current.querySelector(
        '[data-state="active"]'
      );
      if (activeTabElement) {
        const value =
          activeTabElement.getAttribute("data-value") ||
          activeTabElement.textContent ||
          "";
        setActiveTab(value);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <TabsPrimitive.List
      ref={(node) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        listRef.current = node;
      }}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900/50 py-1 text-gray-600 dark:text-gray-400 relative overflow-hidden backdrop-blur-sm border border-gray-200 dark:border-gray-800",
        className
      )}
      {...props}
    >
      {/* Animated background indicator */}
      <AnimatePresence>
        {activeTab && tabPositions[activeTab] && (
          <motion.div
            className="absolute top-1.5 bottom-1.5 bg-primary rounded-lg shadow-md border border-gray-200 dark:border-gray-700 z-0"
            initial={false}
            animate={{
              left: tabPositions[activeTab].left,
              width: tabPositions[activeTab].width,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          />
        )}
      </AnimatePresence>
      {children}
    </TabsPrimitive.List>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-10",
      "data-[state=active]:text-primary-foreground data-[state=active]:shadow-none",
      "data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400",
      "hover:text-gray-700 dark:hover:text-gray-200 data-[state=active]:hover:text-primary-foreground",
      "select-none cursor-pointer",
      className
    )}
    {...props}
  >
    <motion.div
      className="flex items-center gap-2"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  </TabsPrimitive.Content>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
