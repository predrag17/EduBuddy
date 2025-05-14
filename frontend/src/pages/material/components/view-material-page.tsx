import { DataTable } from "@/components/data-table";
import { MaterialDto } from "@/model";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { materialColumns } from "./material-columns";
import { useAuth } from "@/components/providers/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Navbar } from "@/components/navbar";
import toast, { Toaster } from "react-hot-toast";
import { deleteMaterial, fetchAllMaterials } from "@/service/material-service";
import DeleteItemDialog from "@/components/delete-material-dialog";

const ViewMaterialPage = () => {
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMaterialLoading, setIsMaterialLoading] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialDto | null>(
    null
  );
  const auth = useAuth();

  useEffect(() => {
    setMaterials([]);
    const fetchMaterials = async () => {
      try {
        setIsLoading(true);
        const response = await fetchAllMaterials();
        setMaterials(response);
      } catch (error) {
        console.error("Failed to fetch materials", error);
        toast.error("Error fetching materials. Try refreshing.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, [auth.user]);

  const handleDelete = async () => {
    setIsMaterialLoading(true);
    setIsDeleteDialogOpen(false);
    try {
      if (selectedMaterial) {
        await deleteMaterial(selectedMaterial.id);
        toast.success("Successfully deleted material!");
        setMaterials((prev) =>
          prev.filter((material) => material.id !== selectedMaterial.id)
        );
      }
    } catch (error: any) {
      console.error("Error deleting material", error);
      toast.error("Error deleting material!");
    } finally {
      setIsMaterialLoading(false);
      setSelectedMaterial(null);
    }
  };

  if (!auth?.user || isLoading) {
    return (
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-32">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-10 pt-20 sm:pt-24">
        <Toaster />

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
              columns={materialColumns(
                auth?.user.roleName,
                setSelectedMaterial,
                setIsDeleteDialogOpen
              )}
              data={materials}
              filterColumn="subject"
              filterTitle="Search material..."
              canSearch={true}
            />
          </motion.div>
        </div>
      </div>

      {selectedMaterial && isDeleteDialogOpen && (
        <DeleteItemDialog
          isDialogOpen={isDeleteDialogOpen}
          onDialogClose={() => setIsDeleteDialogOpen(false)}
          onDialogConfirm={handleDelete}
          title="Are you sure you want to delete the material?"
        />
      )}

      {isMaterialLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center">
              <LoadingSpinner />
            </div>
            <p className="text-white text-lg font-semibold">
              Deleting your file, please wait...
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ViewMaterialPage;
