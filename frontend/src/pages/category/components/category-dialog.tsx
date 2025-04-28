import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CategoryDto } from "@/model";
import { createCategory, updateCategory } from "@/service/category-service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CategoryDialogProps {
  isDialogOpen: boolean;
  onDialogClose: () => void;
  onCategoryAdded: () => void;
  category: CategoryDto | null;
}

const CategoryDialog = ({
  isDialogOpen,
  onDialogClose,
  onCategoryAdded,
  category,
}: CategoryDialogProps) => {
  const [categoryName, setCategoryName] = useState(category?.name || "");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    } else {
      setCategoryName("");
    }
  }, [category]);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required!");
      return;
    }

    try {
      if (category !== null) {
        await updateCategory(category.id, categoryName);
        toast.success("Successfully updating category.");
      } else {
        await createCategory(categoryName);
        toast.success("Successfully creating category.");
      }

      onCategoryAdded();
      setCategoryName("");
      onDialogClose();
    } catch (error) {
      toast.error("Error creating/updating category. Try again!");
      console.error("Error creating/updating category.", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Update category" : "Add new category"}
          </DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Category Name..."
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleAddCategory} disabled={!categoryName.trim()}>
            {category ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
