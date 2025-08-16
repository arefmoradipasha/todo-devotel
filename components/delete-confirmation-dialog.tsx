"use client"

import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Todo } from "@/lib/features/todoSlice"

interface DeleteConfirmationDialogProps {
  todo: Todo | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteConfirmationDialog({
  todo,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmationDialogProps) {
  if (!todo) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete todo
          </DialogTitle>
          <DialogDescription className="text-left">
            are  you sure you want to delete this todo
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 bg-muted rounded-lg border border-destructive/20">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-medium text-sm">{todo.todo}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> deleting...
              </>
            ) : (
              "Delete todo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
