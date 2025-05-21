import { useAuth } from "@/components/providers/auth-provider";
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
import { LoginSchema } from "@/schemas";
import { login } from "@/service/user-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);

    try {
      const response = await login(values.username, values.password);
      setUser(response.user);
      toast.success("Successfully logged in. Welcome!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: any) {
      console.error("Error while login", error);
      toast.error("Invalid credentials, try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <Toaster />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          Login
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="username"
                      placeholder="john2003"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="*****"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 hover:text-indigo-600"
              disabled={isLoading}
            >
              {isLoading ? "Login..." : "Login"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <p className="text-gray-400">
            You don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:underline">
              Register!
            </Link>
          </p>
        </div>
      </motion.div>
      <Link to="/">
        <Button
          className="mt-6 bg-gray-700 hover:bg-gray-600 text-white hover:text-indigo-600"
          disabled={isLoading}
        >
          Go to Home
        </Button>
      </Link>
    </div>
  );
};

export default LoginForm;
