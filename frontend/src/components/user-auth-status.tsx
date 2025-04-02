import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const UserAuthStatus = () => {
  return (
    <>
      {/* Top Right Buttons */}
      <div className="absolute top-6 right-6 flex space-x-4 z-20">
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
      </div>
    </>
  );
};

export default UserAuthStatus;
