import { MapPin } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Loading amazing destinations...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;




