"use client";

import Image from "next/image";
import { IELTSAcademicTask1 } from "@/types/exam/ielts-academic/writing/writing";

interface AcademicTask1RendererProps {
  task: IELTSAcademicTask1;
}

export function AcademicTask1Renderer({ task }: AcademicTask1RendererProps) {
  return (
    <div className="space-y-4">
      {task.visualData?.chartImage && (
        <div className="flex justify-center">
          <Image
            src={task.visualData.chartImage}
            alt="Chart for analysis"
            width={600}
            height={400}
            className="rounded-lg border border-border max-w-full h-auto"
          />
        </div>
      )}

      {task.visualData?.chartDescription && (
        <p className="text-sm text-muted-foreground">
          {task.visualData.chartDescription}
        </p>
      )}

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Minimum words: {task.minimumWords}</span>
        <span>Time limit: {task.timeLimit} minutes</span>
      </div>
    </div>
  );
}
