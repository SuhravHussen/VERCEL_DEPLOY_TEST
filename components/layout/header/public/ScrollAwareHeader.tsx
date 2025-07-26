"use client";

import { useEffect, useState } from "react";

export function ScrollAwareHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Consider scrolled if page is scrolled more than 10px
      setScrolled(window.scrollY > 10);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center px-4 py-4 sm:px-6 lg:px-8 transition-all duration-300">
      <header
        className={`w-full md:max-w-4xl lg:max-w-5xl rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "shadow-lg border-border/40 bg-background/60 backdrop-blur-sm"
            : "border-transparent bg-transparent"
        }`}
      >
        {children}
      </header>
    </div>
  );
}
