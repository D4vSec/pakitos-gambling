import { z } from "zod"

// Login: todos obligatorios
export const loginSchema = z
    .object({
        username: z.string().min(1, "El username es obligatorio"),
        email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
        password: z.string().min(1, "La contraseña es obligatoria").min(6, "Mínimo 6 caracteres"),
        confirmPassword: z.string().min(1, "Debes confirmar tu contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    })

// Registro: todos obligatorios
export const registerSchema = z
    .object({
        username: z.string().min(1, "El username es obligatorio"),
        email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
        password: z.string().min(1, "La contraseña es obligatoria").min(6, "Mínimo 6 caracteres"),
        confirmPassword: z.string().min(1, "Debes confirmar tu contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    })
