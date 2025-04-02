import axiosInstance from "@/config/axiosInstance";

export const register = async (
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post("/register", {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error while registering user.", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/login", { email, password });

    return response.data;
  } catch (error: any) {
    console.error("Error while login", error);
    throw error;
  }
};
