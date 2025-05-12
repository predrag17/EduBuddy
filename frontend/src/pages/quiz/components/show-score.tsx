import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface ShowScoreProps {
  score: number;
  totalQuestions: number;
  onDownload: () => void;
}

export const ShowScore = ({
  score,
  totalQuestions,
  onDownload,
}: ShowScoreProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center z-10"
    >
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Quiz Completed!</h1>
      <p className="text-lg sm:text-xl">
        Your Score: {score} / {totalQuestions}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link to="/quizzes">
          <Button variant="default" className="w-full sm:w-auto">
            All Quizzes
          </Button>
        </Link>

        <Link to="/chatbot">
          <Button variant="outline" className="w-full sm:w-auto">
            Learn with our EduBuddy-bot
          </Button>
        </Link>
      </div>
      <div className="flex justify-center mt-3">
        <Card
          onClick={onDownload}
          className="bg-indigo-500/10 p-6 w-64 sm:w-72 text-center rounded-2xl border border-indigo-400/30"
        >
          <CardContent>
            <Sparkles className="w-10 h-10 mx-auto text-indigo-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-300">
              Download your quiz
            </h3>
            <p className="text-sm opacity-80 text-gray-300">
              Download your quiz so you can see your results
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
