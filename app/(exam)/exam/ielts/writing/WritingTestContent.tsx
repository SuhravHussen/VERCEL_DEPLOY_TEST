import { IELTSWritingTestPage } from "@/components/pages/exam/ielts/writing";
import { getWritingTestBasicInfo } from "@/server-actions/exam/get-exam-data";

interface WritingTestContentProps {
  regId?: string;
  practiceId?: string;
}

export default async function WritingTestContent({
  regId,
  practiceId,
}: WritingTestContentProps) {
  // Determine the type and id based on available props
  const type: "practice" | "registered" = practiceId
    ? "practice"
    : "registered";
  const id = practiceId || regId;

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Request</h1>
          <p className="text-gray-600 mb-6">
            No exam ID or registration ID provided.
          </p>
        </div>
      </div>
    );
  }

  const writingTest = await getWritingTestBasicInfo(id, type);

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

  return (
    <IELTSWritingTestPage
      writingTest={writingTest}
      regId={regId || id} // Pass regId if available, otherwise pass the id
      type={type}
    />
  );
}
