import * as z from "zod";

export const RegisterSchema = z
  .object({
    username: z.string().min(1, {
      message: "Корисничко име е задолжително",
    }),
    firstName: z.string().min(1, {
      message: "Името е задолжително",
    }),
    lastName: z.string().min(1, {
      message: "Презимето е задолжително",
    }),
    email: z.string().email({
      message: "Емеил адресата е задолжителна и мора да биде валидна",
    }),
    password: z
      .string()
      .min(8, {
        message: "Лозинката мора да содржи минимум 8 карактери",
      })
      .regex(/[A-Z]/, {
        message: "Лозинката мора да содржи барем една голема буква",
      })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Лозинката мора да содржи барем еден специјален знак",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Лозинките не се совпаѓаат",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  username: z.string().min(1, {
    message: "Корисничко име е задолжително",
  }),
  password: z.string().min(1, {
    message: "Лозинката е задолжителна",
  }),
});

export const UserSchema = z.object({
  firstName: z.string().min(1, {
    message: "Името е задолжително",
  }),
  lastName: z.string().min(1, {
    message: "Презимето е задолжително",
  }),
  username: z.string().min(1, {
    message: "Корисничкото име е задолжително",
  }),
  email: z.string().email({
    message: "Емеил адресата е задолжителна и мора да биде валидна",
  }),
});

export const UploadMaterialSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  file: z
    .any()
    .refine((file) => file instanceof File, { message: "File is required" })
    .optional(),
});
