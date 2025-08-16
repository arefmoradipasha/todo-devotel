"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToggleTodo, useDeleteTodo } from "@/hooks/use-todos"
import type { Todo } from "@/lib/features/todoSlice"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"

interface TodoItemProps {
  todo: Todo
  isDragging?: boolean
  isDragOver?: boolean
  onDragStart?: (e: React.DragEvent, todo: Todo) => void
  onDragEnd?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDragEnter?: (e: React.DragEvent) => void
  onDragLeave?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent, targetTodo: Todo) => void
}

export function TodoItem({
  todo,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
}: TodoItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const toggleTodo = useToggleTodo()
  const deleteTodo = useDeleteTodo()

  const handleToggle = useCallback(async () => {
    try {
      await toggleTodo.mutateAsync(todo)
    } catch (error) {
      console.error("Failed to toggle todo:", error)
    }
  }, [toggleTodo, todo])

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteTodo.mutateAsync(todo.id)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Failed to delete todo:", error)
    }
  }, [deleteTodo, todo.id])

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteDialog(false)
  }, [])

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      console.log("[v0] TodoItem drag start:", todo.id)
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", todo.id.toString())

      onDragStart?.(e, todo)
    },
    [onDragStart, todo],
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      onDragOver?.(e)
    },
    [onDragOver],
  )

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragEnter?.(e)
    },
    [onDragEnter],
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      onDragLeave?.(e)
    },
    [onDragLeave],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      console.log("[v0] TodoItem drop on:", todo.id)
      onDrop?.(e, todo)
    },
    [onDrop, todo],
  )

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-3 p-4 bg-card border rounded-lg transition-all duration-200",
          "hover:shadow-md hover:border-primary/20",
          isDragging && "opacity-50 scale-[0.98] shadow-lg border-primary/50 bg-primary/5",
          isDragOver && "border-primary border-2 bg-primary/10 scale-[1.02] shadow-md",
          deleteTodo.isPending && "opacity-50 pointer-events-none",
          todo.completed && "bg-muted/50",
          "cursor-move select-none",
        )}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={cn(
            "cursor-grab active:cursor-grabbing text-muted-foreground transition-all duration-200",
            "opacity-0 group-hover:opacity-100",
            isDragging && "opacity-100 text-primary",
          )}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={toggleTodo.isPending}
          className="flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        />

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium transition-all duration-200",
              todo.completed && "line-through text-muted-foreground",
            )}
          >
            {todo.todo}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            ID: {todo.id} • User: {todo.userId}
          </p>
        </div>

        <div className="flex-shrink-0">
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-200",
              todo.completed
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
            )}
          >
            {todo.completed ? "Completed" : "Pending"}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteClick}
          disabled={deleteTodo.isPending}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteConfirmationDialog
        todo={todo}
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteTodo.isPending}
      />
    </>
  )
}
