"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, GripVertical } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  isDragging?: boolean
}

export function SimpleTodoItem({ todo, onToggle, onDelete, isDragging }: TodoItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(todo.id)
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "group flex items-center gap-3 p-4 bg-card rounded-lg border transition-all duration-200",
        "hover:shadow-md hover:border-primary/20",
        isDragging && "shadow-lg border-primary/50 bg-primary/5 rotate-2 scale-105",
      )}
      draggable
    >
      <div className="cursor-grab active:cursor-grabbing text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
        <GripVertical className="h-4 w-4" />
      </div>

      <Checkbox checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} className="flex-shrink-0" />

      <span
        className={cn(
          "flex-1 text-sm transition-all duration-200",
          todo.completed && "line-through text-muted-foreground",
        )}
      >
        {todo.todo}
      </span>

      <Button
        variant={showDeleteConfirm ? "destructive" : "ghost"}
        size="sm"
        onClick={handleDelete}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-all duration-200",
          showDeleteConfirm && "opacity-100",
        )}
      >
        <Trash2 className="h-4 w-4" />
        {showDeleteConfirm && <span className="ml-1 text-xs">Sure?</span>}
      </Button>
    </motion.div>
  )
}
