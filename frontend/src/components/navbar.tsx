import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserAuthStatus from "./user-auth-status";

export function Navbar() {
  return (
    <>
      <UserAuthStatus />

      <div className="absolute top-6 left-4 sm:top-6 sm:left-6 z-50">
        <Link to="/">
          <Button
            className="rounded-lg w-full sm:w-auto min-h-[20px] transition-all duration-300
            bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
          >
            <ArrowLeft className="w-6 h-6 transition-all duration-300 text-white" />
          </Button>
        </Link>
      </div>
    </>
  );
}
