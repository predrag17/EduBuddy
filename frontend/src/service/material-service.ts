import axiosInstance from "@/config/axiosInstance";
import { MaterialDto } from "@/model";
import { snakeToCamel } from "@/utils/case-converter";

interface UploadMaterialProps {
  subject: string;
  description: string;
  categoryId: number;
  file: File;
}

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

export const uploadMaterial = async (params: UploadMaterialProps) => {
  try {
    const formData = new FormData();
    formData.append("subject", params.subject);
    formData.append("description", params.description);
    formData.append("category_id", params.categoryId.toString());
    formData.append("file", params.file);

    const response = await axiosInstance.post("/material", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error uploading material.");
    throw error;
  }
};
