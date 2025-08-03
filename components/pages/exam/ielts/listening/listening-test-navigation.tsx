"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ListeningTestNavigationProps {
  currentSection: number;
  onSectionChange: (section: number) => void;
  sectionProgress: Record<number, { total: number; answered: number }>;
}

export default function ListeningTestNavigation({
  currentSection,
  onSectionChange,
  sectionProgress,
}: ListeningTestNavigationProps) {
  const sections = [
    { id: 1, title: "Part 1", description: "Conversation in everyday context" },
    { id: 2, title: "Part 2", description: "Monologue in everyday context" },
    {
      id: 3,
      title: "Part 3",
      description: "Conversation in educational context",
    },
    { id: 4, title: "Part 4", description: "Academic monologue" },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-2">
      <h2 className="font-bold text-lg mb-4">Test Sections</h2>

      {sections.map((section) => {
        const progress = sectionProgress[section.id];
        const isActive = currentSection === section.id;

        return (
          <Button
            key={section.id}
            variant={isActive ? "default" : "ghost"}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              "w-full justify-start p-4 h-auto text-left",
              isActive && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{section.title}</span>
                {progress && (
                  <Badge variant={isActive ? "secondary" : "default"}>
                    {progress.answered}/{progress.total}
                  </Badge>
                )}
              </div>
              <p className="text-sm opacity-80 truncate">
                {section.description}
              </p>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
