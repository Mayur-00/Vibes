import { z } from "zod";

export const songSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: z.string().min(1, "Genre is required"),
  file: z
    .any()
    .refine((file) => file instanceof File || (file && file.length > 0), {
      message: "Audio file is required",
    }),
    description:z.string().min(1,"Discription is required")
});