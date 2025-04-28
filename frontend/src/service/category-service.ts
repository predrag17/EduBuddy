import axiosInstance from "@/config/axiosInstance";

export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get("/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories", error);
    throw error;
  }
};

export const createCategory = async (categoryName: string) => {
  try {
    const response = await axiosInstance.post("/category", {
      name: categoryName,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating category", error);
    throw error;
  }
};

export const updateCategory = async (id: number, categoryName: string) => {
  try {
    const response = await axiosInstance.put(`/category/update/${id}`, {
      name: categoryName,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating category", error);
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    await axiosInstance.delete(`/category/delete/${id}`);
  } catch (error: any) {
    console.error("Error deleting category", error);
    throw error;
  }
};
