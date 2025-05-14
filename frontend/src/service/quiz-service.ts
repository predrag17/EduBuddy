import axiosInstance from "@/config/axiosInstance";

export const generateQuestions = async ({
  difficulty,
  selectedMaterial,
}: {
  difficulty: string;
  selectedMaterial: number;
}) => {
  try {
    const response = await axiosInstance.post("/questions", {
      difficulty,
      material_id: selectedMaterial,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error generating questions", error);
  }
};

export const downloadQuizResult = async ({ quizId }: { quizId: number }) => {
  try {
    const response = await axiosInstance.post(
      `/quizzes/${quizId}/download-result`,
      {},
      { responseType: "blob" }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error downloading quiz result:", error);
    throw error;
  }
};

export const fetchAllQuizResults = async () => {
  try {
    const response = await axiosInstance.get("quizzes/results");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all quiz results", error);
    throw error;
  }
};

export const saveQuizResult = async ({
  quizId,
  questionResults,
  score,
}: {
  quizId: number;
  questionResults: { question_id: number; selected_answer: string }[];
  score: number;
}) => {
  try {
    const response = await axiosInstance.post("quiz-result/create", {
      quiz_id: quizId,
      score: score,
      question_results: questionResults,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating quiz results", error);
    throw error;
  }
};
