import { DataTable } from "@/components/data-table";
import { MaterialDto } from "@/model";
import { motion } from "framer-motion";
import { useState } from "react";
import { materialColumns } from "./material-columns";
import UserAuthStatus from "@/components/user-auth-status";

const ViewMaterialPage = () => {
  const [materials, setMaterials] = useState<MaterialDto[]>([]);

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-32">
      <UserAuthStatus />

      {/* Background Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-full h-full bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 animate-pulse"
          animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-indigo-500/20 blur-3xl top-1/3 left-1/4 rounded-full"
          animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-fuchsia-500/20 blur-3xl bottom-1/4 right-1/4 rounded-full"
          animate={{ x: [0, -15, 15, 0], y: [0, 15, -15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 text-center drop-shadow-xl z-10 text-indigo-400"
      >
        View Materials
      </motion.h1>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="w-full"
      >
        <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-2xl overflow-hidden p-5">
          <DataTable
            columns={materialColumns()}
            data={materials}
            filterColumn="subject"
            filterTitle="Пребарај материјал..."
            canSearch={true}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ViewMaterialPage;
