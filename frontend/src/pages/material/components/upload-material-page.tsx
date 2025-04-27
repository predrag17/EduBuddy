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
import { useState } from "react";
import { UploadMaterialSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import UserAuthStatus from "@/components/user-auth-status";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UploadMaterialPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UploadMaterialSchema>>({
    resolver: zodResolver(UploadMaterialSchema),
    defaultValues: {
      subject: "",
      description: "",
      category: "",
      file: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof UploadMaterialSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("subject", values.subject);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("file", "");

    try {
      console.log("Test");
      toast.success("Successfully saved");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-32">
        <UserAuthStatus />

        <div className="absolute top-6 left-4 z-10 sm:top-6 sm:left-6">
          <Link to="/">
            <Button
              variant="outline"
              className="bg-indigo-500/20 hover:bg-indigo-500/30 text-white border border-indigo-300 p-2.5 sm:p-3 rounded-md"
              aria-label="Go back to home"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>

        {/* Background Animation */}
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

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold text-center mb-8 text-indigo-400 z-10"
        >
          Upload Your Material
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-2xl space-y-6 z-10 border border-indigo-400/20"
        >
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
                      <FormMessage className="text-red-500" />
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
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          placeholder="Enter category (e.g., High School)"
                          className="bg-gray-800 text-white border-gray-600"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
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
                              onChange(file);
                            }
                          }}
                          className="bg-gray-800 text-white border-gray-600"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
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
    </>
  );
};

export default UploadMaterialPage;
