import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { MaterialDto } from "@/model";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MaterialSelectionProps {
  materials: MaterialDto[];
  selectedMaterial: number | null;
  onMaterialChange: (value: number | null) => void;
}

export const MaterialSelection = ({
  materials,
  selectedMaterial,
  onMaterialChange,
}: MaterialSelectionProps) => {
  const navigate = useNavigate();
  const handleUpdateMaterial = () => {
    console.log("update");
  };

  const handleDeleteMaterial = () => {
    console.log("delete");
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center z-10"
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Choose Material</h1>
      <div className="flex justify-center items-center gap-2">
        <Combobox
          title={"material"}
          options={materials}
          value={selectedMaterial ?? undefined}
          onChange={onMaterialChange}
          onUpdate={handleUpdateMaterial}
          onDelete={handleDeleteMaterial}
          getLabel={(item) => item.file}
          getId={(item) => item.id}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => navigate("/material/upload")}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};
