"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Plus, Loader2, Sparkles } from "lucide-react"
import { useAddTodo } from "@/hooks/use-todos"
import { createTodoSchema, type CreateTodoInput } from "@/lib/validations/todoSchema"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"

export function AddTodoForm() {
  const [isExpanded, setIsExpanded] = useState(false)
  const addTodo = useAddTodo()

  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      todo: "",
    },
  })

  const onSubmit = async (data: CreateTodoInput) => {
    try {
      await addTodo.mutateAsync({
        todo: data.todo,
        completed: false,
        userId: 53, // بصورت تشستی قرار دادم
      })

      form.reset()
      setIsExpanded(false)
    } catch (error) {
      console.error("Failed to add todo:", error)
    }
  }

  const handleCancel = () => {
    form.reset()
    setIsExpanded(false)
  }

  if (!isExpanded) {
    return (
   
        <Card className="border-dashed border-2 hover:border-primary/50 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-6 text-center" onClick={() => setIsExpanded(true)}>
            <div
              className="flex items-center justify-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors"
            >
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="group-hover:animate-none"
              >
                <Plus className="h-5 w-5" />
              </motion.div>
              <span className="font-medium">Add new todo</span>
              <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Click to create a new task</p>
          </CardContent>
        </Card>
    
    )
  }

  return (

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <motion.div animate={{ rotate: [0, 90, 0] }} transition={{ duration: 0.3 }}>
              <Plus className="h-5 w-5" />
            </motion.div>
            Add New Todo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="todo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Todo Description</FormLabel>
                    <FormControl>
        
                        <Input
                          placeholder="Enter your todo..."
                          {...field}
                          disabled={addTodo.isPending}
                          autoFocus
                          className="transition-all duration-200 focus:scale-[1.02]"
                        />
        
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AnimatePresence>
                {addTodo.isError && (
      
                    <Alert variant="destructive">
                      <AlertDescription>Failed to add todo. Please try again.</AlertDescription>
                    </Alert>
             
                )}
              </AnimatePresence>

              <div
                className="flex gap-2 justify-end"

              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={addTodo.isPending}
                  className="transition-all duration-200 hover:scale-105 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addTodo.isPending}
                  className="transition-all duration-200 hover:scale-105"
                >
                  {addTodo.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />  Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Add Todo
                    </>
                  )}
                </Button>

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

  )
}
