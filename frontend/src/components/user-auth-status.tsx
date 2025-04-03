import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuth } from "./providers/auth-provider";

const UserAuthStatus = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {}, [auth?.user]);

  const handleLogout = async () => {
    try {
      auth.authLogout();
      toast.success("Successfully logged out!");

      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Try logout again");
    }
  };

  return (
    <div className="absolute top-6 right-6 flex space-x-4 z-20 items-center">
      <Toaster />

      {auth?.user ? (
        <div className="flex items-center space-x-3">
          <User className="text-indigo-500 text-2xl" />
          <span className="text-indigo-500 font-semibold">
            {auth?.user.username}
          </span>
          <Button
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-500 hover:text-white"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      ) : (
        <>
          <Link to="/login">
            <Button
              variant="outline"
              className="border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="default"
              className="bg-indigo-500 text-white hover:bg-indigo-600 hover:text-indigo-400"
            >
              Register
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default UserAuthStatus;
