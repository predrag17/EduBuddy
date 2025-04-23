import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut, User, UserPen } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "./providers/auth-provider";
import LogoutDialog from "./logout-dialog";

const UserAuthStatus = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      auth.authLogout();
      toast.success("Successfully logged out!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Try logout again");
    }
  };

  return (
    <div className="absolute top-6 right-6 z-20">
      <Toaster />

      {auth?.user ? (
        <div className="relative" ref={menuRef}>
          <Button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-indigo-100"
          >
            <User className="text-indigo-500 text-2xl" />
            <span className="text-indigo-500 font-semibold">
              {auth.user.username}
            </span>
          </Button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-200 shadow-lg rounded-lg transition-all animate-fade-in z-50">
              <div className="flex flex-col gap-y-1 p-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto justify-center border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                >
                  <UserPen />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto justify-center border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setIsDialogOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  <LogOut /> Logout
                </Button>
              </div>
            </div>
          )}

          {/* Logout Confirmation Dialog */}
          {showLogoutConfirm && (
            <LogoutDialog
              isDialogOpen={isDialogOpen}
              onDialogClose={() => {
                setIsDialogOpen(false);
              }}
              onDialogConfirm={handleLogout}
              username={auth.user.username}
            />
          )}
        </div>
      ) : (
        <div className="flex space-x-3">
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
              className="bg-indigo-500 text-white hover:bg-indigo-600"
            >
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserAuthStatus;
