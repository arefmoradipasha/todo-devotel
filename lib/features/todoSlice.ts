import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

interface TodoState {
  todos: Todo[]
  draggedTodo: Todo | null
}

const initialState: TodoState = {
  todos: [],
  draggedTodo: null,
}

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.unshift(action.payload)
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload)
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) {
        state.todos[index] = action.payload
      }
    },
    reorderTodos: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const [removed] = state.todos.splice(fromIndex, 1)
      state.todos.splice(toIndex, 0, removed)
    },
    setDraggedTodo: (state, action: PayloadAction<Todo | null>) => {
      state.draggedTodo = action.payload
    },
  },
})

export const { setTodos, addTodo, removeTodo, toggleTodo, updateTodo, reorderTodos, setDraggedTodo } = todoSlice.actions

export default todoSlice.reducer
