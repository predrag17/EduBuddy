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

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error generating questions", error);
  }
};
