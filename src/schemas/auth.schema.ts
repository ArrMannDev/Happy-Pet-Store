import {z} from "zod"

export const LoginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password too short"),
})

export const SignUpSchema = z.object({
  full_name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
  account_type: z.string().min(1, "Account type is required"),
});