import { z } from "zod";
const CourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  class: z.string().optional().nullable(), // Optional or can be null
  tumbnail: z
    .instanceof(File, { message: "Thumbnail must be a file" })
    .optional(),
  price: z.string().min(1, "Price is required"),
  level: z
    .string()
    .refine(
      (value) => ["Beginner", "Intermediate", "Advanced"].includes(value),
      {
        message: "please choose valid course level",
      }
    ),
});
export type courseSchema = z.infer<typeof CourseSchema>;
