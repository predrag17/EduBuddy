import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface LogoutDialogProps {
  isDialogOpen: boolean;
  onDialogClose: () => void;
  onDialogConfirm: () => void;
  username: string;
}

const LogoutDialog = ({
  isDialogOpen,
  onDialogClose,
  onDialogConfirm,
  username,
}: LogoutDialogProps) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <p className="text-sm text-indigo-200">
            Are you sure you want to log out,{" "}
            <span className="font-semibold text-fuchsia-300">{username}</span>?
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              className="border border-indigo-500 border-solid text-indigo-200 hover:bg-indigo-900"
              onClick={onDialogClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-fuchsia-700 to-pink-600 text-white hover:from-fuchsia-800 hover:to-pink-700"
              onClick={onDialogConfirm}
            >
              Yes, Logout
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
