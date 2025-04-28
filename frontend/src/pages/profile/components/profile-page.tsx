import { LoadingSpinner } from "@/components/loading-spinner";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import EditUserDialog from "@/pages/auth/components/edit-user-dialog";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const auth = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!auth?.user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-16 sm:pt-24">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-full h-full bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 animate-pulse"
            animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.05, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-96 h-96 bg-indigo-500/20 blur-3xl top-1/3 left-1/4 rounded-full"
            animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-96 h-96 bg-fuchsia-500/20 blur-3xl bottom-1/4 right-1/4 rounded-full"
            animate={{ x: [0, -15, 15, 0], y: [0, 15, -15, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-semibold text-fuchsia-300 mb-6"
          >
            Your Profile
          </motion.h1>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-medium text-fuchsia-300">Full Name</h2>
            <p className="text-lg text-indigo-200">
              {auth.user.firstName} {auth.user.lastName}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-medium text-fuchsia-300">Username</h2>
            <p className="text-lg text-indigo-200">{auth.user.username}</p>
          </div>
          <div>
            <h2 className="text-xl font-medium text-fuchsia-300">Email</h2>
            <p className="text-lg text-indigo-200">{auth.user.email}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto justify-center border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            Edit profile
          </Button>
          <Link to={"/"}>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto justify-center border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
            >
              Home
            </Button>
          </Link>
        </div>
      </div>

      {isDialogOpen && (
        <EditUserDialog
          isDialogOpen={isDialogOpen}
          onDialogClose={() => {
            setIsDialogOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ProfilePage;
