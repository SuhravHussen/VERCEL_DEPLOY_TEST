"use client";

import { IELTSGeneralTask1 } from "@/types/exam/ielts-academic/writing/writing";

interface GeneralTask1RendererProps {
  task: IELTSGeneralTask1;
}

export function GeneralTask1Renderer({ task }: GeneralTask1RendererProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">{task.scenario}</p>

      {task.bulletPoints && task.bulletPoints.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium text-sm">
            Write a letter to {task.recipient || "the relevant person"}. In your
            letter:
          </p>
          <ul className="text-sm space-y-1">
            {task.bulletPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Tone: {task.tone.charAt(0).toUpperCase() + task.tone.slice(1)}
      </p>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Minimum words: {task.minimumWords}</span>
        <span>Time limit: {task.timeLimit} minutes</span>
      </div>
    </div>
  );
}
