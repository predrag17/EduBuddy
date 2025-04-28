import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/providers/auth-provider";
import { JSX, useEffect, useState } from "react";
import { LoadingSpinner } from "../loading-spinner";

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const auth = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (auth.user !== null) {
      setChecked(true);
    } else {
      const token = localStorage.getItem("token");
      if (!token) {
        setChecked(true);
      }
    }
  }, [auth.user]);

  if (!checked) {
    return (
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-32">
        <LoadingSpinner />
      </div>
    );
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
