import { IELTSListeningTestPage } from "@/components/pages/exam/ielts/listening";
import { getListeningTestBasicInfo } from "@/server-actions/exam/get-exam-data";

interface ListeningTestContentProps {
  regId?: string;
  practiceId?: string;
}

export default async function ListeningTestContent({
  regId,
  practiceId,
}: ListeningTestContentProps) {
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

  const listeningTest = await getListeningTestBasicInfo(id, type);

  if (!listeningTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold  mb-4">Listening Test Not Found</h1>
          <p className="text-gray-600 mb-6">
            The requested listening test could not be found or is not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <IELTSListeningTestPage
      listeningTest={listeningTest}
      regId={regId || id} // Pass regId if available, otherwise pass the id
      type={type}
    />
  );
}
