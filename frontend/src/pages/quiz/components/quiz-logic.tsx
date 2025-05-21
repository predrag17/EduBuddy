import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { QuestionDto, AnswerDto } from "@/model";

interface QuizLogicProps {
  questions: QuestionDto[];
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  onAnswerSelect: (answer: AnswerDto) => void;
  maxAnswerLength: number;
}

export const QuizLogic = ({
  questions,
  currentQuestionIndex,
  selectedAnswer,
  onAnswerSelect,
  maxAnswerLength,
}: QuizLogicProps) => {
  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className={`z-10 w-full mx-auto px-4 ${
          maxAnswerLength > 50 ? "max-w-5xl" : "max-w-2xl"
        }`}
      >
        <Card className="bg-white/10 p-4 sm:p-6 text-center rounded-2xl border border-white/20">
          <CardContent className="p-0">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
              {currentQuestion.text}
            </h2>
            <div className="mt-3 sm:mt-5 grid gap-2 sm:gap-3">
              {currentQuestion.answers.map((answer) => (
                <Button
                  key={answer.id}
                  className="w-full text-xs sm:text-sm md:text-base text-center whitespace-normal break-words rounded-lg bg-black/70 hover:bg-black/80 transition-all min-h-[3rem] sm:min-h-[3.5rem]"
                  onClick={() => onAnswerSelect(answer)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="block">{answer.text}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
