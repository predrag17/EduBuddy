import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { AnswerDto, MaterialDto, QuestionDto, QuizDto } from "@/model";
import { fetchAllMaterials } from "@/service/material-service";
import {
  downloadQuizResult,
  generateQuestions,
  saveQuizResult,
} from "@/service/quiz-service";
import toast, { Toaster } from "react-hot-toast";
import { MaterialSelection } from "./material-selection";
import { DifficultySelection } from "./difficulty-selection";
import { QuizLogic } from "./quiz-logic";
import { ShowScore } from "./show-score";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function StartQuizPage() {
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [maxAnswerLength, setMaxAnswerLength] = useState(0);
  const [selectedAnswersMap, setSelectedAnswersMap] = useState<{
    [key: number]: string;
  }>({});
  const [createdQuiz, setCreatedQuiz] = useState<QuizDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

      setIsLoading(true);
      try {
        const quiz = await generateQuestions(params);
        setCreatedQuiz(quiz);
        setQuestions(quiz.questions);
        calculateMaxAnswerLength(quiz.questions);
      } catch (error: any) {
        console.error("Error fetching questions for the quiz", error);
        toast.error("Error generating the quiz, please start again!");
        window.location.reload();
      } finally {
        setIsLoading(false);
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

    const updatedAnswersMap = {
      ...selectedAnswersMap,
      [questions[currentQuestionIndex].id]: answer.text,
    };

    setSelectedAnswersMap(updatedAnswersMap);

    if (answer.is_correct) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
        saveResults(updatedAnswersMap);
      }
    }, 1000);
  };

  const saveResults = async (answersMap: { [key: number]: string }) => {
    try {
      const quizId = createdQuiz?.id;
      if (!quizId) {
        toast.error("Quiz ID missing for result saving");
        return;
      }

      const questionResults = Object.entries(answersMap).map(
        ([question_id, selected_answer]) => ({
          question_id: Number(question_id),
          selected_answer,
        })
      );

      await saveQuizResult({ quizId, questionResults, score });
      toast.success("Quiz results saved!");
    } catch (error) {
      console.error("Error saving quiz results", error);
      toast.error("Failed to save quiz results");
    }
  };

  const handleDownloadResult = async () => {
    try {
      const quizId = createdQuiz?.id || null;
      if (!quizId) return toast.error("Quiz ID missing");

      const blob = await downloadQuizResult({
        quizId,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const quizTitle = createdQuiz?.title;
      link.setAttribute("download", `${quizTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Could not download result");
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-32">
      <Toaster />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-500/20 blur-3xl top-1/3 left-1/4 rounded-full animate-ping" />
        <div className="absolute w-96 h-96 bg-pink-500/20 blur-3xl bottom-1/4 right-1/4 rounded-full animate-ping" />
      </div>

      <Navbar />

      {!difficulty && (
        <DifficultySelection
          onDifficultySelect={(level) => setDifficulty(level)}
        />
      )}

      {difficulty && !selectedMaterial && (
        <MaterialSelection
          materials={materials}
          selectedMaterial={selectedMaterial}
          onMaterialChange={(value) => setSelectedMaterial(value)}
        />
      )}

      {difficulty && selectedMaterial && !showScore && (
        <QuizLogic
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          maxAnswerLength={maxAnswerLength}
        />
      )}

      {showScore && (
        <ShowScore
          score={score}
          totalQuestions={questions.length}
          onDownload={handleDownloadResult}
        />
      )}

      {isLoading && (
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
              Generating questions, please wait...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
