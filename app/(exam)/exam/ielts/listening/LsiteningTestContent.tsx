import { getListeningTestData } from "@/server-actions/exam/get-exam-data";
import IELTSListeningTestPage from "@/components/pages/exam/ielts/listening/ielts-listening-test-page";

export default async function ListeningTestContent({
  examId,
}: {
  examId: string;
}) {
  const listeningTest = await getListeningTestData(examId as string);

  if (!listeningTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Listening Test Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested listening test could not be found or is not available.
          </p>
          {/* <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <IELTSListeningTestPage
      listeningTest={listeningTest}
      examId={examId as string}
    />
  );
}
