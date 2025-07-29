import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import TierRouting from "@/components/TierRouting";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="cinematic-page">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <TierRouting />
        </div>
      </div>
    </ProtectedRoute>
  );
}