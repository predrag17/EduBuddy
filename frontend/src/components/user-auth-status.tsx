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
    <div className="absolute top-6 right-4 mb-4 sm:top-6 sm:right-6 z-10">
      <Toaster />

      {auth?.user ? (
        <div className="relative" ref={menuRef}>
          <Button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-white text-indigo-600 hover:bg-indigo-50 transition-all"
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-semibold text-sm sm:text-base">
              {auth.user.username}
            </span>
          </Button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 shadow-xl rounded-lg z-50 animate-fade-in text-sm sm:text-base menu-dropdown">
              <div className="flex flex-col gap-1 p-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 justify-center w-full border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                >
                  <UserPen className="w-4 h-4" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 justify-center w-full border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setIsDialogOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}

          {/* Logout Confirmation Dialog */}
          {showLogoutConfirm && (
            <LogoutDialog
              isDialogOpen={isDialogOpen}
              onDialogClose={() => setIsDialogOpen(false)}
              onDialogConfirm={handleLogout}
              username={auth.user.username}
            />
          )}
        </div>
      ) : (
        <div className="flex gap-2 sm:gap-3">
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
            >
              Login
            </Button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              variant="default"
              className="w-full sm:w-auto bg-indigo-500 text-white hover:bg-indigo-600"
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
