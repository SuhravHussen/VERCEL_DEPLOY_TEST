"use client";

import Image from "next/image";
import { IELTSTask2 } from "@/types/exam/ielts-academic/writing/writing";

interface Task2RendererProps {
  task: IELTSTask2;
}

export function Task2Renderer({ task }: Task2RendererProps) {
  return (
    <div className="space-y-4">
      {task.backgroundInfo && (
        <p className="text-sm leading-relaxed">{task.backgroundInfo}</p>
      )}

      {task.backgroundImage && (
        <div className="flex justify-center">
          <Image
            src={task.backgroundImage}
            alt="Background context"
            width={500}
            height={300}
            className="rounded-lg border border-border max-w-full h-auto"
          />
        </div>
      )}

      <p className="text-sm leading-relaxed font-bold">
        {task.specificQuestion}
      </p>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Minimum words: {task.minimumWords}</span>
        <span>Time limit: {task.timeLimit} minutes</span>
      </div>
    </div>
  );
}
