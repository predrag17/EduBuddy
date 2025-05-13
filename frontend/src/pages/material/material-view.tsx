import { useParams } from "react-router-dom";
import MaterialSinglePage from "./components/material-single-page";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import toast, { Toaster } from "react-hot-toast";
import { MaterialDto } from "@/model";
import { fetchMaterialDetails } from "@/service/material-service";

export default function MaterialView() {
  const { material_id } = useParams();
  const [material, setMaterial] = useState<MaterialDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!material_id) return;

    const fetchMaterial = async () => {
      setLoading(true);
      try {
        const material_details = await fetchMaterialDetails(
          Number(material_id)
        );
        setMaterial(material_details);
      } catch (err) {
        console.error("Error fetching material", err);
        toast.error("Error fetching material, try refreshing!");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [material_id]);

  if (loading || material === null) {
    return (
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-32">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <MaterialSinglePage material={material} />;
    </>
  );
}
