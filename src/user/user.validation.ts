import { z, ZodType } from "zod";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(1).max(20),
        password: z.string().min(8).max(20),
        email: z.string().email()
    })

    static readonly LOGIN: ZodType = z.object({
        email: z.string().email(),
        password: z.string().min(8).max(20)
    })
}