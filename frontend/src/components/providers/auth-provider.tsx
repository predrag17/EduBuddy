import { createContext, useContext, useEffect, useState } from "react";
import { UserDto } from "@/model";
import { authenticate, logout } from "@/service/user-service";

interface AuthContextType {
  user: UserDto | null;
  setUser: (user: UserDto | null) => void;
  authLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authenticate();
        setUser(response ? response : null);
      } catch (error) {
        console.error("Error authenticating", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const authLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, authLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
