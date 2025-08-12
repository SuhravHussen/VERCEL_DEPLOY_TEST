import { IELTSReadingTestPage } from "@/components/pages/exam/ielts/reading";
import { getReadingTestBasicInfoByRegId } from "@/server-actions/exam/get-exam-data";

export default async function ReadingTestContent({ regId }: { regId: string }) {
  const readingTest = await getReadingTestBasicInfoByRegId(regId as string);

  if (!readingTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Reading Test Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested reading test could not be found or is not available.
          </p>
        </div>
      </div>
    );
  }

  return <IELTSReadingTestPage readingTest={readingTest} regId={regId} />;
}
