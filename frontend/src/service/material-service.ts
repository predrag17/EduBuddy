import axiosInstance from "@/config/axiosInstance";
import { MaterialDto } from "@/model";
import { snakeToCamel } from "@/utils/case-converter";

interface UploadMaterialProps {
  subject: string;
  description: string;
  category_id: number;
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
    formData.append("category_id", params.category_id.toString());
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

export const fetchMaterialDetails = async (material_id: number) => {
  try {
    const response = await axiosInstance.get(`/material/${material_id}`);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching material details", error);
    throw error;
  }
};
