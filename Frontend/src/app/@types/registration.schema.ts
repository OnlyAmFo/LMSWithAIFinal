import z from "zod";
const RegistrationSchema = z
  .object({
    firstName: z.string().min(3, "first name must be at least 3 character"),
    lastName: z.string().min(3, "last name must be at least 3 character"),
    email: z.email("Invalid email"),
    gender: z
      .string()
      .refine((value) => ["Male", "Female", "Others"].includes(value), {
        message: "please choose valid gender",
      }),
    class: z.int("class should be integer").optional(),
    password: z
      .string()
      .min(8, "password must be at least 8 character")
      .regex(/[A-Z]/, "password must contain at least one uppercase")
      .regex(/[0-9]/, "password must contain at least one integer"),
    confirmPassword: z.string(),
    profile:z.file().optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "confirm password must match password",
    path: ["confirmPassword"],
  });
export type registrationSchema = z.infer<typeof RegistrationSchema>;
