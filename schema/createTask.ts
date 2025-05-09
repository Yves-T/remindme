import { z } from "zod";

export const createTaskSchema = z.object({
  collectionId: z.number().nonnegative(),
  content: z
    .string()
    .min(9, { message: "Task content must be at least 8 character" }),
  expiresAt: z.date().optional(),
});

export type createTaskSchemaType = z.infer<typeof createTaskSchema>;
