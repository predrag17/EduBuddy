import axiosInstance from "@/config/axiosInstance";
import { removeToken, setToken } from "@/utils/auth";

interface UpdateUserParams {
  first_name: string;
  last_name: string;
  username: string;
}

export const register = async (
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post("/register", {
      username,
      first_name,
      last_name,
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error while registering user.", error);
    throw error;
  }
};

export const login = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post("/login", { username, password });
    setToken(response.data.token);

    return response.data;
  } catch (error: any) {
    console.error("Error while login", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post("/logout");
    removeToken();
  } catch (error) {
    console.error("Error while logout", error);
    throw error;
  }
};

export const authenticate = async () => {
  try {
    const response = await axiosInstance.get("/authenticate");
    return response.data;
  } catch (error: any) {
    return null;
  }
};

export const updateUser = async ({
  first_name,
  last_name,
  username,
}: UpdateUserParams) => {
  try {
    const response = await axiosInstance.patch("/user/update", {
      first_name,
      last_name,
      username,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};
