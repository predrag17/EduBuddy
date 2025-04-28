import { DataTable } from "@/components/data-table";
import { MaterialDto } from "@/model";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { materialColumns } from "./material-columns";
import { useAuth } from "@/components/providers/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Navbar } from "@/components/navbar";

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
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-10 pt-20 sm:pt-24">
      <Navbar />

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

      <div className="w-full flex flex-col justify-start items-center mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-5xl space-y-6 z-10 border border-indigo-400/20"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-8 text-indigo-400 z-10"
          >
            View Materials
          </motion.h2>

          <DataTable
            columns={materialColumns(auth?.user.roleName)}
            data={materials}
            filterColumn="subject"
            filterTitle="Пребарај материјал..."
            canSearch={true}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ViewMaterialPage;
