import type { Todo } from "../features/todoSlice"

const API_BASE = process.env.BASE_URL

export interface TodosResponse {
  todos: Todo[]
  total: number
  skip: number
  limit: number
}

export interface CreateTodoRequest {
  todo: string
  completed: boolean
  userId: number
}

function logRequest(method: string, url: string, options?: RequestInit) {
  console.log("🚀 [REQUEST]", {
    method,
    url,
    headers: options?.headers,
    body: options?.body ? JSON.parse(options.body as string) : null,
  })
}

async function logResponse<T>(res: Response): Promise<T> {
  const data = await res.json()
  console.log("📥 [RESPONSE]", {
    status: res.status,
    ok: res.ok,
    url: res.url,
    data,
  })
  return data
}

export const todoApi = {

  getTodos: async (): Promise<TodosResponse> => {
    const url = `${API_BASE}/todos`
    logRequest("GET", url)
    const response = await fetch(url)
    if (!response.ok) {
      console.error("❌ Failed to fetch todos")
      throw new Error("Failed to fetch todos")
    }
    return logResponse<TodosResponse>(response)
  },

  addTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    const url = `${API_BASE}/todos/add`
    logRequest("POST", url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    })
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    })
    if (!response.ok) {
      console.error("❌ Failed to add todo")
      throw new Error("Failed to add todo")
    }
    return logResponse<Todo>(response)
  },

  deleteTodo: async (id: number): Promise<Todo> => {
    const url = `${API_BASE}/todos/${id}`
    logRequest("DELETE", url, { method: "DELETE" })
    const response = await fetch(url, { method: "DELETE" })
    if (!response.ok) {
      console.error("❌ Failed to delete todo")
      throw new Error("Failed to delete todo")
    }
    return logResponse<Todo>(response)
  },

  updateTodo: async (id: number, updates: Partial<Todo>): Promise<Todo> => {
    const url = `${API_BASE}/todos/${id}`
    logRequest("PUT", url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) {
      console.error("❌ Failed to update todo")
      throw new Error("Failed to update todo")
    }
    return logResponse<Todo>(response)
  },
}
