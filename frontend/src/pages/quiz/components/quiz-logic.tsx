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
  return (
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
                {questions[currentQuestionIndex].answers.map((answer) => (
                  <Button
                    key={answer.id}
                    className={`w-full text-sm sm:text-base text-center whitespace-normal break-words rounded-lg bg-black/70 hover:bg-black/80 transition-all min-h-[3.5rem]`}
                    onClick={() => onAnswerSelect(answer)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="block text-wrap">{answer.text}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
