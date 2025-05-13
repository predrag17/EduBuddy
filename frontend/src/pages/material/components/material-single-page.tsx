import { MaterialDto } from "@/model";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

interface MaterialSinglePageProps {
  material: MaterialDto;
}

export default function MaterialSinglePage({
  material,
}: MaterialSinglePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="h-full min-w-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-16 sm:pt-24">
        {/* Background animation */}
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

        {/* Header */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-semibold text-fuchsia-300 mb-6"
          >
            Material View
          </motion.h1>
        </div>

        {/* Material Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-medium text-fuchsia-300">Subject</h2>
            <p className="text-lg text-indigo-200">{material.subject}</p>
          </div>
          <div>
            <h2 className="text-xl font-medium text-fuchsia-300">Category</h2>
            <p className="text-lg text-indigo-200">{material.category.name}</p>
          </div>
          <div>
            <h2 className="text-xl font-medium text-fuchsia-300">Filename</h2>
            <p className="text-lg text-indigo-200">{material.file}</p>
          </div>
          <div>
            <h2 className="text-xl font-medium text-fuchsia-300">
              Description
            </h2>
            <p
              className="text-lg text-indigo-200 underline cursor-pointer hover:text-indigo-300"
              onClick={() => setIsModalOpen(true)}
            >
              Click to view full description
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <Link to={"/materials"}>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto justify-center border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
            >
              All materials
            </Button>
          </Link>
          <Link to={"/"}>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto justify-center border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
            >
              Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Description Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full text-white relative">
            <h2 className="text-2xl font-semibold text-fuchsia-300 mb-4">
              Description
            </h2>
            <p className="text-indigo-200">{material.description}</p>
            <Button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
