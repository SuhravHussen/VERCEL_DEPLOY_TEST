import * as React from "react";
import { Editor } from "@tiptap/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/tiptap-ui-primitive/popover";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { PaletteIcon } from "@/components/tiptap-icons/palette-icon";
import "./color-popover.scss";

const COLOR_PALETTE = [
  "#000000",
  "#e60000",
  "#ff9900",
  "#ffff00",
  "#008a00",
  "#0066cc",
  "#9933ff",
  "#ffffff",
  "#facccc",
  "#ffebcc",
  "#ffffcc",
  "#cce8cc",
  "#cce0f5",
  "#ebd6ff",
  "#bbbbbb",
  "#f06666",
  "#ffc266",
  "#ffff66",
  "#66b966",
  "#66a3e0",
  "#c285ff",
  "#888888",
  "#a10000",
  "#b26b00",
  "#b2b200",
  "#006100",
  "#0047b2",
  "#6b24b2",
  "#444444",
  "#5c0000",
  "#663d00",
  "#666600",
  "#003700",
  "#002966",
  "#3d1466",
];

export function ColorPopover({ editor }: { editor: Editor | null }) {
  const [open, setOpen] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  if (!editor) return null;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          aria-label="Text color"
          tooltip="Text color"
        >
          <PaletteIcon
            className="tiptap-button-icon"
            style={{ color: selectedColor || undefined }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="tiptap-color-popover-content">
        <div className="tiptap-color-palette-grid grid grid-cols-7 ">
          {COLOR_PALETTE.map((color) => (
            <Button
              key={color}
              type="button"
              data-style="ghost"
              className="tiptap-button-color ml-2"
              style={
                {
                  "--color": color,
                } as Record<string, string>
              }
              onClick={() => {
                editor.chain().focus().setColor(color).run();
                setSelectedColor(color);
                setOpen(false);
              }}
              aria-label={color}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-center">
          <Button
            type="button"
            data-style="ghost"
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              setSelectedColor(null);
              setOpen(false);
            }}
          >
            Remove color
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
