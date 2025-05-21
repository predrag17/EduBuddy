import axiosInstance from "@/config/axiosInstance";
import { ConversationDto } from "@/model";

export const createAnswer = async (
  message: string,
  selectedConversation: number | null
) => {
  try {
    const response = await axiosInstance.post("/chatbot/message", {
      message,
      conversation_id: selectedConversation,
    });
    console.log(response)
    return response.data.message;
  } catch (error: any) {
    console.error("Error creating answer", error);
    throw error;
  }
};

export const fetchMessages = async (conversation_id: number) => {
  try {
    const response = await axiosInstance.get(
      `/chatbot/messages/${conversation_id}`
    );
    return response.data.messages;
  } catch (error: any) {
    console.error("Error fetching messages", error);
    throw error;
  }
};

export const fetchConversations = async (): Promise<ConversationDto[]> => {
  try {
    const response = await axiosInstance.get("/chatbot/conversations");
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const fetchMessagesForConversation = async (conversation_id: number) => {
  try {
    const response = await axiosInstance.get(
      `/chatbot/messages/${conversation_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching messages for the conversations", error);
    throw error;
  }
};

export const fetchTTS = async (text: string) => {
  try {
    const response = await axiosInstance.post(
      `/tts`,
      { text },
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching TTS audio", error);
    throw error;
  }
};
