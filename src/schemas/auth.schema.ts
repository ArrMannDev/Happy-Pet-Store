import {z} from "zod"

export const LoginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password too short"),
})

export const SignUpSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
  accountType: z.string().min(1, "Account type is required"),
});