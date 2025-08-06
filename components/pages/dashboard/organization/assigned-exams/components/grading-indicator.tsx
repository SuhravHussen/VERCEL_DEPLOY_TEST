import React from "react";

interface GradingIndicatorProps {
  show: boolean;
}

export function GradingIndicator({ show }: GradingIndicatorProps) {
  if (!show) return null;

  return (
    <div className="absolute top-2 right-2 z-30">
      <div className="relative flex items-center justify-center w-6 h-6">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 w-6 h-6 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)",
            animation: "ping 2s infinite",
          }}
        ></div>

        {/* Middle ring */}
        <div
          className="absolute w-4 h-4 rounded-full border border-emerald-200/50"
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            animation: "pulse 1.5s infinite",
          }}
        ></div>

        {/* Inner core dot */}
        <div
          className="relative w-2.5 h-2.5 rounded-full shadow-lg"
          style={{
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            boxShadow:
              "0 0 8px rgba(16, 185, 129, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
            animation: "pulse 1s infinite alternate",
          }}
        ></div>
      </div>
    </div>
  );
}
