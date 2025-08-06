import { IELTSWritingTestPage } from "@/components/pages/exam/ielts/writing";
import { getWritingTestData } from "@/server-actions/exam/get-exam-data";

export default async function WritingTestContent({
  examId,
}: {
  examId: string;
}) {
  const writingTest = await getWritingTestData(examId as string);

  if (!writingTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Writing Test Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested writing test could not be found or is not available.
          </p>
        </div>
      </div>
    );
  }

  return <IELTSWritingTestPage writingTest={writingTest} />;
}
