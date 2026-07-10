import { z } from "zod";

export const ContactFormSchema = z.object({
    email: z.string().email(),
    subject: z.string().min(2, {
        message: "Subject must be at least 2 characters.",
    }),
    body: z.string().min(50, {
        message: "Body must be at least 50 characters.",
    }),
})

export type ContactFormSchemaType = z.infer<typeof ContactFormSchema>;

export interface ContactFormResponse {
    success: boolean,
    message: string,
}