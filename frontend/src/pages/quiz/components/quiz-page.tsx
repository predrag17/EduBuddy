import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Cpu, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuizPage() {
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-32">
      <Navbar />

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-full h-full max-w-full max-h-full bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 animate-pulse"
          animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 max-w-full max-h-full bg-indigo-500/20 blur-3xl top-1/3 left-1/4 rounded-full"
          animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 max-w-full max-h-full bg-fuchsia-500/20 blur-3xl bottom-1/4 right-1/4 rounded-full"
          animate={{ x: [0, -15, 15, 0], y: [0, 15, -15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 text-center drop-shadow-xl z-10 text-indigo-400"
      >
        Edubuddy Quiz
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-lg sm:text-xl text-center opacity-80 max-w-xl sm:max-w-2xl z-10 text-gray-300"
      >
        Ready to challenge yourself? Start a quiz or review all available ones.
      </motion.p>

      <div className="relative flex flex-col sm:flex-row flex-wrap justify-center items-center space-y-6 sm:space-y-0 sm:space-x-6 mt-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/quizzes">
            <Card className="bg-indigo-500/10 p-6 w-64 sm:w-72 text-center rounded-2xl border border-indigo-400/30">
              <CardContent>
                <Sparkles className="w-10 h-10 mx-auto text-indigo-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-indigo-300">
                  View your quizzes
                </h3>
                <p className="text-sm opacity-80 text-gray-300">
                  Browse and manage all the quizzes you've created or taken.
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/start-quiz">
            <Card className="bg-violet-500/10 p-6 w-64 sm:w-72 text-center rounded-2xl border border-violet-400/30">
              <CardContent>
                <Cpu className="w-10 h-10 mx-auto text-violet-400 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-violet-300">
                  Start Quiz
                </h3>
                <p className="text-sm opacity-80 text-gray-300">
                  Test your knowledge with a new quiz. Challenge yourself and
                  see how much you've learned!
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
