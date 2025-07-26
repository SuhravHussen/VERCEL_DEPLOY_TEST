import * as React from "react";

export function PaletteIcon({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 2C5.58 2 2 5.13 2 9c0 2.5 1.5 4.5 4 4.5.28 0 .5.22.5.5 0 1.1.9 2 2 2h2c2.21 0 4-1.79 4-4 0-3.87-3.58-7-8-7zm-3 7a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zm-3 3a1 1 0 110-2 1 1 0 010 2zm0-8c4.42 0 8 3.13 8 7 0 2.21-1.79 4-4 4h-2c-1.1 0-2-.9-2-2 0-.28-.22-.5-.5-.5-2.5 0-4-2-4-4.5C2 5.13 5.58 2 10 2z"
        fill="currentColor"
      />
    </svg>
  );
}
