"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { TodoItem } from "./todo-item"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { reorderTodos, setDraggedTodo } from "@/lib/features/todoSlice"
import type { Todo } from "@/lib/features/todoSlice"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface TodoListProps {
  filter?: "all" | "completed" | "pending"
  searchQuery?: string
}

export function TodoList({ filter = "all", searchQuery = "" }: TodoListProps) {
  const dispatch = useAppDispatch()
  const { todos, draggedTodo } = useAppSelector((state) => state.todos)
  const [dragOverId, setDragOverId] = useState<number | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === "all" || (filter === "completed" && todo.completed) || (filter === "pending" && !todo.completed)

    const matchesSearch = searchQuery === "" || todo.todo.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const handleDragStart = useCallback(
    (e: React.DragEvent, todo: Todo) => {
      console.log("[v0] Drag start for todo:", todo.id)
      dispatch(setDraggedTodo(todo))
      setIsDragActive(true)

      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", todo.id.toString())
      document.body.classList.add("dragging")
    },
    [dispatch],
  )

  const handleDragEnd = useCallback(() => {
    console.log("[v0] Drag end")
    dispatch(setDraggedTodo(null))
    setDragOverId(null)
    setIsDragActive(false)

    document.body.classList.remove("dragging")
  }, [dispatch])

  const handleDragEnter = useCallback(
    (e: React.DragEvent, todo: Todo) => {
      e.preventDefault()

      if (draggedTodo && draggedTodo.id !== todo.id) {
        console.log("[v0] Drag enter over todo:", todo.id)
        setDragOverId(todo.id)
      }
    },
    [draggedTodo],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverId(null)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, targetTodo: Todo) => {
      e.preventDefault()
      console.log("[v0] Drop on todo:", targetTodo.id)

      setDragOverId(null)

      if (!draggedTodo || draggedTodo.id === targetTodo.id) {
        console.log("[v0] Invalid drop - same todo or no dragged todo")
        return
      }

      const fromIndex = todos.findIndex((todo) => todo.id === draggedTodo.id)
      const toIndex = todos.findIndex((todo) => todo.id === targetTodo.id)

      console.log("[v0] Reordering from index", fromIndex, "to index", toIndex)

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        dispatch(reorderTodos({ fromIndex, toIndex }))
      }
    },
    [draggedTodo, todos, dispatch],
  )

  if (filteredTodos.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-muted-foreground">
          {searchQuery ? (
            <div>
              <p className="text-lg font-medium">No todos found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          ) : filter === "completed" ? (
            <div>
              <p className="text-lg font-medium">No completed todos</p>
              <p className="text-sm mt-1">Complete some todos to see them here</p>
            </div>
          ) : filter === "pending" ? (
            <div>
              <p className="text-lg font-medium">No pending todos</p>
              <p className="text-sm mt-1">All your todos are completed!</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium">No todos yet</p>
              <p className="text-sm mt-1">Add your first todo to get started</p>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className={cn("space-y-3 transition-all duration-200", isDragActive && "bg-muted/20 rounded-lg p-2")}>
      <AnimatePresence>
        {isDragActive && (
          <motion.div
            className="text-center py-2 text-sm text-muted-foreground bg-primary/5 rounded-lg border border-dashed border-primary/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            Drag to reorder • Drop on another todo to change position
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <motion.div
            key={todo.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{
              duration: 0.2,
              layout: { duration: 0.2, ease: "easeInOut" },
            }}
          >
            <TodoItem
              todo={todo}
              isDragging={draggedTodo?.id === todo.id}
              isDragOver={dragOverId === todo.id}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, todo)}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isDragActive && (
          <motion.div
            className="h-12 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 flex items-center justify-center text-sm text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 48 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            onDragOver={handleDragOver}
            onDrop={(e) => {
              e.preventDefault()
              console.log("[v0] Drop at end")
              if (draggedTodo) {
                const fromIndex = todos.findIndex((todo) => todo.id === draggedTodo.id)
                const toIndex = todos.length - 1
                if (fromIndex !== -1 && fromIndex !== toIndex) {
                  dispatch(reorderTodos({ fromIndex, toIndex }))
                }
              }
            }}
          >
            Drop here to move to end
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
