import z from "zod"

export const signUpSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.email(),
    password: z.string().min(6).max(30),
})

export const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(30),
})
