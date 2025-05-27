import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isOpen: boolean;
}

export const LoadingOverlay = ({ isOpen }: LoadingOverlayProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-md mx-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Finding the Best Deals</h3>
        <p className="text-gray-600 text-center">
          We're searching across multiple platforms to find you the best prices and offers...
        </p>
      </div>
    </div>
  );
};
