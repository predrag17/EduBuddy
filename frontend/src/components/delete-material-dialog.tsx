import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteItemDialogProps {
  isDialogOpen: boolean;
  onDialogClose: () => void;
  onDialogConfirm: () => void;
  title: string;
}

const DeleteItemDialog = ({
  isDialogOpen,
  onDialogClose,
  onDialogConfirm,
  title,
}: DeleteItemDialogProps) => {
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={onDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deleting</DialogTitle>
          </DialogHeader>
          {title}
          <DialogFooter>
            <Button
              variant="outline"
              className="border border-indigo-500 border-solid text-indigo-200 hover:bg-indigo-900"
              onClick={onDialogClose}
            >
              No
            </Button>
            <Button
              className="bg-gradient-to-r from-fuchsia-700 to-pink-600 text-white hover:from-fuchsia-800 hover:to-pink-700"
              onClick={onDialogConfirm}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteItemDialog;
