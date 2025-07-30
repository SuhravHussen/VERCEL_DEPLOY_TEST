"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground relative",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 hover:text-foreground/80 relative z-10",
      className
    )}
    {...props}
  />
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

// Enhanced TabsList with background indicator animation
const AnimatedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    value?: string;
  }
>(({ className, children, value, ...props }, ref) => {
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
          left: rect.left - listRect.left,
          width: rect.width,
        };
      });

      setTabPositions(positions);
    }
  }, [children]);

  React.useEffect(() => {
    if (value) {
      setActiveTab(value);
    }
  }, [value]);

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
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground relative overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Animated background indicator */}
      <AnimatePresence>
        {activeTab && tabPositions[activeTab] && (
          <motion.div
            className="absolute top-1 bottom-1 bg-background rounded-sm shadow-sm z-0"
            initial={false}
            animate={{
              left: tabPositions[activeTab].left,
              width: tabPositions[activeTab].width,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
        )}
      </AnimatePresence>
      {children}
    </TabsPrimitive.List>
  );
});
AnimatedTabsList.displayName = "AnimatedTabsList";

// Enhanced TabsTrigger with hover animations
const AnimatedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-10 transition-colors duration-200",
      "data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground",
      "hover:text-foreground/80",
      className
    )}
    {...props}
  >
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.span>
  </TabsPrimitive.Trigger>
));
AnimatedTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Enhanced TabsContent with stagger animation for multiple children
const AnimatedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    staggerChildren?: boolean;
  }
>(({ className, children, staggerChildren = false, ...props }, ref) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren ? 0.1 : 0,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {staggerChildren ? (
          React.Children.map(children, (child, index) => (
            // @ts-ignore
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        ) : (
          // @ts-ignore
          <motion.div variants={itemVariants}>{children}</motion.div>
        )}
      </motion.div>
    </TabsPrimitive.Content>
  );
});
AnimatedTabsContent.displayName = TabsPrimitive.Content.displayName;

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  AnimatedTabsList,
  AnimatedTabsTrigger,
  AnimatedTabsContent,
};
