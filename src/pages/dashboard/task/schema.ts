import { toTypedSchema } from "@vee-validate/zod";
import z from "zod";

export const taskSchema = toTypedSchema(
    z.object({
        title: z.string().min(1, {
            message: "title is required field.",
        }),
        description: z.string().optional(),
        priority: z.string().min(1, {
            message: "title is required field.",
        }),
    })
);
