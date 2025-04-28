import axiosInstance from "@/config/axiosInstance";
import { MaterialDto } from "@/model";
import { snakeToCamel } from "@/utils/case-converter";

export const fetchAllMaterials = async () => {
  try {
    const response = await axiosInstance.get("/material");
    const materials: MaterialDto[] = snakeToCamel(response.data);
    return materials;
  } catch (error: any) {
    console.error("Error fetching materials", error);
    throw error;
  }
};
