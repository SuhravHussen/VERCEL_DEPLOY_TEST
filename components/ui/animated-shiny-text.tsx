import { ComponentPropsWithoutRef, CSSProperties, FC } from "react";

import { cn } from "@/lib/utils";

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",

        // Shine effect with keyframes animation instead of relying on external class
        "relative bg-clip-text bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80 bg-[length:var(--shiny-width)_100%] animate-[shine_2s_ease-in-out_infinite]",

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
