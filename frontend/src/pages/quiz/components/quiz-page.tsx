import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { AnswerDto, MaterialDto, QuestionDto } from "@/model";
import { fetchAllMaterials } from "@/service/material-service";
import { generateQuestions } from "@/service/quiz-service";
import toast, { Toaster } from "react-hot-toast";

export default function QuizPage() {
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [maxAnswerLength, setMaxAnswerLength] = useState(0);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materials = await fetchAllMaterials();
        setMaterials(materials);
      } catch (error: any) {
        console.error("Error fetching materials", error);
        toast.error("Error fetching materials. Refresh!");
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    const fetchGeneratedQuestions = async () => {
      if (!difficulty || selectedMaterial === null) return;

      const params = {
        difficulty: difficulty,
        selectedMaterial: selectedMaterial,
      };

      try {
        const quiz = await generateQuestions(params);
        setQuestions(quiz.questions);
        calculateMaxAnswerLength(quiz.questions);
      } catch (error: any) {
        console.error("Error fetching questions for the quiz", error);
        toast.error("Error generating the quiz, please start again!");
        window.location.reload();
      }
    };

    if (difficulty && selectedMaterial) {
      fetchGeneratedQuestions();
    }
  }, [difficulty, selectedMaterial]);

  const calculateMaxAnswerLength = (questions: QuestionDto[]) => {
    let maxLength = 0;
    questions.forEach((q) =>
      q.answers.forEach((a) => {
        if (a.text.length > maxLength) maxLength = a.text.length;
      })
    );
    setMaxAnswerLength(maxLength);
  };

  const handleAnswerSelect = (answer: AnswerDto) => {
    setSelectedAnswer(answer.id);
    if (answer.is_correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-32">
      <Toaster />

      {/* Background Animations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-500/20 blur-3xl top-1/3 left-1/4 rounded-full animate-ping" />
        <div className="absolute w-96 h-96 bg-pink-500/20 blur-3xl bottom-1/4 right-1/4 rounded-full animate-ping" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Difficulty Selection */}
      {!difficulty && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center z-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            Choose Difficulty
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {["Easy", "Medium", "Hard"].map((level) => (
              <Button
                key={level}
                className="px-6 py-3 text-lg sm:text-xl font-semibold bg-white/20 hover:bg-white/30 transition-all"
                onClick={() => setDifficulty(level.toLowerCase())}
              >
                {level}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Material Selection */}
      {difficulty && !selectedMaterial && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center z-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Choose Material
          </h1>
          <select
            aria-label="Select quiz material"
            className="bg-white/10 text-white border border-white/20 rounded-lg p-4 w-full max-w-sm text-base sm:text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-white/20 transition-all duration-200"
            onChange={(e) => setSelectedMaterial(Number(e.target.value))}
            value={selectedMaterial || ""}
          >
            <option value="" disabled className="text-black">
              Select a material
            </option>
            {materials.map((material) => (
              <option
                key={material.id}
                value={material.id}
                className="text-black"
              >
                {material.file}
              </option>
            ))}
          </select>
        </motion.div>
      )}

      {/* Quiz Logic */}
      {difficulty && selectedMaterial && (
        <>
          {showScore ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center z-10"
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Quiz Completed!
              </h1>
              <p className="text-lg sm:text-xl">
                Your Score: {score} / {questions.length}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button
                  variant="default"
                  onClick={() => location.reload()}
                  className="w-full sm:w-auto"
                >
                  Retry Quiz
                </Button>
                <Link to="/chatbot">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Learn with our EduBuddy-bot
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {questions.length > 0 && (
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className={`z-10 w-full max-w-prose mx-auto ${
                    maxAnswerLength > 50 ? "max-w-2xl" : "max-w-lg"
                  }`}
                >
                  <Card className="bg-white/10 p-6 text-center rounded-2xl border border-white/20">
                    <CardContent>
                      <h2 className="text-lg sm:text-xl font-semibold mb-4">
                        {questions[currentQuestionIndex].text}
                      </h2>
                      <div className="mt-4 grid gap-3">
                        {questions[currentQuestionIndex].answers.map(
                          (answer) => (
                            <Button
                              key={answer.id}
                              className={`w-full text-sm sm:text-base p-10 whitespace-normal break-words ${
                                selectedAnswer === answer.id
                                  ? answer.is_correct
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                  : ""
                              } transition-all`}
                              onClick={() => handleAnswerSelect(answer)}
                              disabled={selectedAnswer !== null}
                            >
                              {answer.text}
                            </Button>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  );
}
