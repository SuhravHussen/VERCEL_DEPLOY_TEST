import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PassageCardProps } from "./types";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function PassageCard({
  group,
  isSelected,
  sectionNumber,
  onSelect,
}: PassageCardProps) {
  return (
    <Card
      key={group.passage?.id}
      className={cn(
        "p-3 sm:p-4 transition-all duration-200 flex flex-col h-full",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
          : "hover:border-primary/50 hover:bg-muted/30 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      )}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <h4 className="font-medium text-sm sm:text-base line-clamp-2">
                {group.passage?.title || "Untitled Passage"}
              </h4>
            </TooltipTrigger>
            <TooltipContent>{group.passage?.title}</TooltipContent>
          </Tooltip>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {group.passage?.difficulty
                ? group.passage.difficulty.charAt(0).toUpperCase() +
                  group.passage.difficulty.slice(1)
                : "Unknown"}
            </Badge>
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {Array.isArray(group.questions)
                ? group.questions.reduce(
                    (
                      total: number,
                      q: {
                        questions?: unknown[] | Record<string, unknown>;
                        id?: string;
                        questionType?: string;
                      }
                    ) => {
                      const innerQuestions = q.questions
                        ? Array.isArray(q.questions)
                          ? q.questions.length
                          : 1
                        : 0;
                      return total + innerQuestions;
                    },
                    0
                  )
                : 0}{" "}
              Questions
            </Badge>
          </div>
        </div>

        {isSelected && sectionNumber && (
          <Badge className="self-start sm:self-center shrink-0 text-xs sm:text-sm mt-1 sm:mt-0">
            Section {sectionNumber}
          </Badge>
        )}
      </div>
    </Card>
  );
}
