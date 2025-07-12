import { FaSearch, FaCar, FaInfoCircle } from 'react-icons/fa';

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaSearch className="text-3xl text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-900">Search by Vehicle</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaCar className="text-xl text-blue-600" />
          <h2 className="font-semibold text-blue-900">Vehicle Search</h2>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <FaInfoCircle className="text-blue-600" />
          <p className="text-blue-800">
            This is where you can search for vehicles and see their status.
          </p>
        </div>
      </div>
    </div>
  );
} 