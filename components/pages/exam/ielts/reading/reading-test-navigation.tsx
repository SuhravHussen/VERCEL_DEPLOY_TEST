"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { IELTSReadingTestSection } from "@/types/exam/ielts-academic/reading/question/question";

interface ReadingTestNavigationProps {
  sections: Array<{ id: number; section: IELTSReadingTestSection }>;
  currentSection: number;
  sectionProgress: Record<number, { total: number; answered: number }>;
  onSectionChange: (section: number) => void;
}

export default function ReadingTestNavigation({
  sections,
  currentSection,
  sectionProgress,
  onSectionChange,
}: ReadingTestNavigationProps) {
  return (
    <div className="p-4 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Test Navigation
      </h3>

      <div className="space-y-3">
        {sections.map(({ id, section }) => {
          const progress = sectionProgress[id];
          const progressPercentage = progress
            ? Math.round((progress.answered / progress.total) * 100)
            : 0;

          return (
            <div key={id} className="space-y-2">
              <Button
                variant={currentSection === id ? "default" : "outline"}
                onClick={() => onSectionChange(id)}
                className="w-full justify-start text-left"
              >
                <div>
                  <div className="font-medium">Section {id}</div>
                  <div className="text-xs opacity-75 truncate">
                    {section.passage?.title || `Reading Passage ${id}`}
                  </div>
                </div>
              </Button>

              <div className="px-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>
                    {progress?.answered || 0}/{progress?.total || 0}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-1" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <div className="flex justify-between mb-1">
            <span>Total Progress:</span>
            <span>
              {Object.values(sectionProgress).reduce(
                (sum, p) => sum + (p?.answered || 0),
                0
              )}
              /
              {Object.values(sectionProgress).reduce(
                (sum, p) => sum + (p?.total || 0),
                0
              )}
            </span>
          </div>
          <Progress
            value={
              Object.values(sectionProgress).reduce(
                (sum, p) => sum + (p?.total || 0),
                0
              ) > 0
                ? Math.round(
                    (Object.values(sectionProgress).reduce(
                      (sum, p) => sum + (p?.answered || 0),
                      0
                    ) /
                      Object.values(sectionProgress).reduce(
                        (sum, p) => sum + (p?.total || 0),
                        0
                      )) *
                      100
                  )
                : 0
            }
            className="h-2"
          />
        </div>
      </div>
    </div>
  );
}
