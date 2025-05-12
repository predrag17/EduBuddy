import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuizSummaryDto } from "@/model";
import { downloadQuizResult } from "@/service/quiz-service";

import { Download, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";

interface QuizActionsProps {
  quizSummary: QuizSummaryDto;
}

const QuizActions = ({ quizSummary }: QuizActionsProps) => {
  const handleDownloadResult = async () => {
    try {
      const quizId = quizSummary.quiz_id;
      if (!quizId) return toast.error("Quiz ID missing");

      const blob = await downloadQuizResult({
        quizId,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const quizTitle = quizSummary.title || "quiz-result";
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="h-4 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black text-white">
        <DropdownMenuItem onClick={handleDownloadResult}>
          <Download className="h-4 w-4 mr-2" />
          download
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuizActions;
