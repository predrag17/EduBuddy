import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DifficultySelectionProps {
  onDifficultySelect: (level: string) => void;
}

export const DifficultySelection = ({
  onDifficultySelect,
}: DifficultySelectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center z-10"
    >
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Choose Difficulty</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {["Easy", "Medium", "Hard"].map((level) => (
          <Button
            key={level}
            className="px-6 py-3 text-lg sm:text-xl font-semibold bg-white/20 hover:bg-white/30 transition-all"
            onClick={() => onDifficultySelect(level.toLowerCase())}
          >
            {level}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
