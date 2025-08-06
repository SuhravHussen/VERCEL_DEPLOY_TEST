"use client";

import { IELTSReadingPassage } from "@/types/exam/ielts-academic/reading/question/question";

interface ReadingPassageContentProps {
  passage: IELTSReadingPassage;
  sectionNumber: number;
}

export default function ReadingPassageContent({
  passage,
  sectionNumber,
}: ReadingPassageContentProps) {
  // Split content into paragraphs for better readability
  const paragraphs = passage.content.split("\n\n").filter((p) => p.trim());

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-none">
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-500 mb-2">
            Reading Passage {sectionNumber}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {passage.title}
          </h1>
          <div className="h-px bg-gray-200"></div>
        </div>

        <div className="prose prose-lg max-w-none">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-800 leading-relaxed">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
