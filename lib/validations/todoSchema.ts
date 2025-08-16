import { z } from "zod"

export const createTodoSchema = z.object({
  todo: z.string().min(1, "Todo text is required").max(200, "Todo text must be less than 200 characters"),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
