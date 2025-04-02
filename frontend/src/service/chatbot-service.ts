import axiosInstance from "@/config/axiosInstance";

export const createAnswer = async (message: string) => {
  try {
    const response = await axiosInstance.post("/chatbot/message", { message });

    return response.data.message;
  } catch (error: any) {
    console.error("Error creating answer", error);
    throw error;
  }
};
