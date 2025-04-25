import { DataTable } from "@/components/data-table";
import { MaterialDto } from "@/model";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { materialColumns } from "./material-columns";
import UserAuthStatus from "@/components/user-auth-status";
import { useAuth } from "@/components/providers/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ViewMaterialPage = () => {
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const auth = useAuth();

  useEffect(() => {
    // TODO: make an API call
    setMaterials([]);
  }, [auth.user]);

  if (!auth?.user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-10 pt-16 sm:pt-20">
      <UserAuthStatus />

      <div className="absolute top-6 left-4 z-10 sm:top-6 sm:left-6">
        <Link to="/">
          <Button
            variant="outline"
            className="bg-indigo-500/20 hover:bg-indigo-500/30 text-white border border-indigo-300 p-2.5 sm:p-3 rounded-md"
            aria-label="Go back to home"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-full h-full bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 animate-pulse"
          animate={{ opacity: [0.5, 0.7, 0.5], scale: [1, 1.02, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-indigo-500/15 blur-3xl top-1/3 left-1/4 rounded-full hidden sm:block"
          animate={{ x: [0, 10, -10, 0], y: [0, -10, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-fuchsia-500/15 blur-3xl bottom-1/4 right-1/4 rounded-full hidden sm:block"
          animate={{ x: [0, -8, 8, 0], y: [0, 8, -8, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mt-10 sm:mt-16 mb-6 sm:mb-10 text-center drop-shadow-lg z-10 text-indigo-400"
      >
        View Materials
      </motion.h1>

      <div className="w-full max-w-[95vw] mt-4 sm:mt-6 flex-1 overflow-auto">
        <DataTable
          columns={materialColumns(auth?.user.roleName)}
          data={materials}
          filterColumn="subject"
          filterTitle="Пребарај материјал..."
          canSearch={true}
        />
      </div>
    </div>
  );
};

export default ViewMaterialPage;
