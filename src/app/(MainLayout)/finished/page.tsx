import { FaCheckCircle, FaClipboardCheck, FaInfoCircle } from "react-icons/fa";

export default function FinishedPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaCheckCircle className="text-3xl text-green-600" />
        <h1 className="text-2xl font-bold text-blue-900">Finished Work</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaClipboardCheck className="text-xl text-green-600" />
          <h2 className="font-semibold text-blue-900">Completed Tasks</h2>
        </div>

        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
          <FaInfoCircle className="text-green-600" />
          <p className="text-green-800">
            This is where you will manage finished work.
          </p>
        </div>
      </div>
    </div>
  );
}
