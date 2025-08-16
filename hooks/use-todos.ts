/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { todoApi, type CreateTodoRequest } from "@/lib/api/todoApi"
import { useAppDispatch } from "@/lib/hooks"
import { setTodos, addTodo, removeTodo, updateTodo } from "@/lib/features/todoSlice"
import type { Todo } from "@/lib/features/todoSlice"

const TODOS_QUERY_KEY = ["todos"]

export function useTodos() {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: async () => {
      const response = await todoApi.getTodos()
      dispatch(setTodos(response.todos))
      return response
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

export function useAddTodo() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: (newTodo: CreateTodoRequest) => todoApi.addTodo(newTodo),
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY })
      const previousTodos = queryClient.getQueryData(TODOS_QUERY_KEY)

      const optimisticTodo: Todo = {
        id: Date.now(),
        todo: newTodo.todo,
        completed: newTodo.completed,
        userId: newTodo.userId,
      }

      dispatch(addTodo(optimisticTodo))

      queryClient.setQueryData(TODOS_QUERY_KEY, (old: any) => {
        if (!old) return old
        return {
          ...old,
          todos: [optimisticTodo, ...old.todos],
          total: old.total + 1,
        }
      })

      return { previousTodos, optimisticTodo }
    },
    onSuccess: (data, variables, context) => {
      if (context?.optimisticTodo) {
        dispatch(removeTodo(context.optimisticTodo.id))
        dispatch(addTodo(data))

        queryClient.setQueryData(TODOS_QUERY_KEY, (old: any) => {
          if (!old) return old
          return {
            ...old,
            todos: old.todos.map((todo: Todo) => (todo.id === context.optimisticTodo.id ? data : todo)),
          }
        })
      }
    },
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos)
      }
      if (context?.optimisticTodo) {
        dispatch(removeTodo(context.optimisticTodo.id))
      }
    },
    onSettled: () => {
    },
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: (todoId: number) => todoApi.deleteTodo(todoId),
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY })

      const previousTodos = queryClient.getQueryData(TODOS_QUERY_KEY)

      dispatch(removeTodo(todoId))

      queryClient.setQueryData(TODOS_QUERY_KEY, (old: any) => {
        if (!old) return old
        return {
          ...old,
          todos: old.todos.filter((todo: Todo) => todo.id !== todoId),
          total: old.total - 1,
        }
      })

      return { previousTodos }
    },
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos)
        const todosData = context.previousTodos as any
        if (todosData?.todos) {
          dispatch(setTodos(todosData.todos))
        }
      }
    },
    onSettled: () => {
    },
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Todo> }) => todoApi.updateTodo(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY })

      const previousTodos = queryClient.getQueryData(TODOS_QUERY_KEY)

      const currentTodos = queryClient.getQueryData(TODOS_QUERY_KEY) as any
      const todoToUpdate = currentTodos?.todos?.find((todo: Todo) => todo.id === id)
      if (todoToUpdate) {
        const updatedTodo = { ...todoToUpdate, ...updates }
        dispatch(updateTodo(updatedTodo))

        queryClient.setQueryData(TODOS_QUERY_KEY, (old: any) => {
          if (!old) return old
          return {
            ...old,
            todos: old.todos.map((todo: Todo) => (todo.id === id ? updatedTodo : todo)),
          }
        })
      }

      return { previousTodos }
    },
    onSuccess: (data) => {
      dispatch(updateTodo(data))
    },
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos)
        const todosData = context.previousTodos as any
        if (todosData?.todos) {
          dispatch(setTodos(todosData.todos))
        }
      }
    },
    onSettled: () => {

    },
  })
}

export function useToggleTodo() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (todo: Todo) => {
      return todoApi.updateTodo(todo.id, { completed: !todo.completed })
    },
    onMutate: async (todo) => {
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY })

      const previousTodos = queryClient.getQueryData(TODOS_QUERY_KEY)

      const updatedTodo = { ...todo, completed: !todo.completed }

      dispatch(updateTodo(updatedTodo))
      queryClient.setQueryData(TODOS_QUERY_KEY, (old: any) => {
        if (!old) return old
        return {
          ...old,
          todos: old.todos.map((t: Todo) => (t.id === todo.id ? updatedTodo : t)),
        }
      })

      return { previousTodos }
    },
    onSuccess: (data) => {
      dispatch(updateTodo(data))
    },
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos)

        const todosData = context.previousTodos as any
        if (todosData?.todos) {
          dispatch(setTodos(todosData.todos))
        }
      }
    },
    onSettled: () => {
    },
  })
}
