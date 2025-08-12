import { IELTSListeningTestPage } from "@/components/pages/exam/ielts/listening";
import { getListeningTestBasicInfoByRegId } from "@/server-actions/exam/get-exam-data";

export default async function ListeningTestContent({
  regId,
}: {
  regId: string;
}) {
  const listeningTest = await getListeningTestBasicInfoByRegId(regId as string);

  if (!listeningTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold  mb-4">Listening Test Not Found</h1>
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
      regId={regId as string}
    />
  );
}
