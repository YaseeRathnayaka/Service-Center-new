import { FaNetworkWired, FaServer, FaInfoCircle } from "react-icons/fa";

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaNetworkWired className="text-3xl text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-900">Network Handling</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaServer className="text-xl text-blue-600" />
          <h2 className="font-semibold text-blue-900">Network Management</h2>
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <FaInfoCircle className="text-blue-600" />
          <p className="text-blue-800">
            This is where you will handle network-related tasks.
          </p>
        </div>
      </div>
    </div>
  );
}
