import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { UploadMaterialSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Combobox } from "@/components/ui/combobox";
import { CategoryDto } from "@/model";
import { LoadingSpinner } from "@/components/loading-spinner";
import { deleteCategory, getAllCategories } from "@/service/category-service";
import { Plus } from "lucide-react";
import CategoryDialog from "@/pages/category/components/category-dialog";
import { uploadMaterial } from "@/service/material-service";
import { useNavigate } from "react-router-dom";

const UploadMaterialPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoryToUpdate, setCategoryToUpdate] = useState<CategoryDto | null>(
    null
  );
  const navigate = useNavigate();

  const isLatinFilename = (fileName: string): boolean => {
    const latinNameRegex = /^[\x00-\x7F]+$/;
    return latinNameRegex.test(fileName);
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const categories = await getAllCategories();
      setCategories(categories);
    } catch (error) {
      console.error("Error fetching categories", error);
      toast.error("Error fetching categories. Try refreshing!");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const form = useForm<z.infer<typeof UploadMaterialSchema>>({
    resolver: zodResolver(UploadMaterialSchema),
    defaultValues: {
      subject: "",
      description: "",
      categoryId: 0,
      file: undefined,
    },
  });

  const handleCategoryAdded = () => {
    fetchCategories();
  };

  const handleUpdateCategory = (category: CategoryDto) => {
    setCategoryToUpdate(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);

      toast.success("Successfully deleting category.");
      fetchCategories();
      if (!categories.length) {
        form.setValue("categoryId", 0);
      }
    } catch (error) {
      toast.error("Error deleting category. Try again!");
      console.error("Error deleting category.", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof UploadMaterialSchema>) => {
    setIsLoading(true);
    try {
      await uploadMaterial(values);

      toast.success("Successfully saved");
      setTimeout(() => {
        navigate("/material");
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingCategories) {
    return (
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-32">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-16 sm:pt-24">
        <Navbar />

        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-full h-full max-w-full max-h-full bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 animate-pulse"
            animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.05, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-96 h-96 max-w-full max-h-full bg-indigo-500/20 blur-3xl top-1/3 left-1/4 rounded-full"
            animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-96 h-96 max-w-full max-h-full bg-fuchsia-500/20 blur-3xl bottom-1/4 right-1/4 rounded-full"
            animate={{ x: [0, -15, 15, 0], y: [0, 15, -15, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mt-6 w-full max-w-2xl space-y-6 z-10 border border-indigo-400/20"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-2xl sm:text-1xl font-bold text-center mb-8 text-indigo-400 z-10"
          >
            Upload Your Material
          </motion.h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          placeholder="Enter subject"
                          className="bg-gray-800 text-white border-gray-600"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isLoading}
                          placeholder="Enter description"
                          className="bg-gray-800 text-white border-gray-600"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Combobox
                            options={categories}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              form.trigger("categoryId");
                            }}
                            onUpdate={handleUpdateCategory}
                            onDelete={handleDeleteCategory}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            <Plus className="w-5 h-5" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel>Upload File (PDF)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf"
                          disabled={isLoading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (!isLatinFilename(file.name)) {
                                toast.error(
                                  "File name must contain only Latin characters."
                                );
                                e.target.value = "";
                                return;
                              }
                              onChange(file);
                            }
                          }}
                          className="bg-gray-800 text-white border-gray-600"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                {isLoading ? "Uploading..." : "Upload Material"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>

      <CategoryDialog
        isDialogOpen={isDialogOpen}
        onDialogClose={() => {
          setIsDialogOpen(false);
          setCategoryToUpdate(null);
        }}
        onCategoryAdded={handleCategoryAdded}
        category={categoryToUpdate}
      />
    </>
  );
};

export default UploadMaterialPage;
