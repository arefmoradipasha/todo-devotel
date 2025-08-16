"use client"

import { useState } from "react"
import { useTodos } from "@/hooks/use-todos"
import { useAppSelector } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { TodoList } from "./todo-list"
import { TodoFilters } from "./todo-filters"
import { AddTodoForm } from "./add-todo-form"
import { motion } from "framer-motion"
import LoadingMain from "./extra/loading"

export function TodoApp() {
  const { isLoading, error, isError } = useTodos()
  const { todos } = useAppSelector((state) => state.todos)
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const totalCount = todos.length
  const completedCount = todos.filter((todo) => todo.completed).length
  const pendingCount = todos.filter((todo) => !todo.completed).length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0



  if (isLoading) {
    return (
      <LoadingMain />
    )
  }

  if (isError) {
    return (
      <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load todos: {error?.message || "Unknown error"}</AlertDescription>
        </Alert>
      </motion.div>
    )
  }

  const stats = [
    {
      icon: Clock,
      label: "Total",
      value: totalCount,
      bgClass: "bg-blue-100 dark:bg-blue-900/20",
      iconClass: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Clock,
      label: "Pending",
      value: pendingCount,
      bgClass: "bg-yellow-100 dark:bg-yellow-900/20",
      iconClass: "text-yellow-600 dark:text-yellow-400",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: completedCount,
      bgClass: "bg-green-100 dark:bg-green-900/20",
      iconClass: "text-green-600 dark:text-green-400",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-4">
       <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </motion.div>
              Todo App
              <motion.div
                className="ml-auto text-sm font-normal text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {completionRate}% Complete
              </motion.div>
            </CardTitle>
            <p className="text-muted-foreground">Manage your tasks efficiently with drag and drop support</p>
          </CardHeader>
        </Card>


      <AddTodoForm />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (

            <Card className="transition-all duration-200 hover:shadow-md" key={index}>
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`p-2 ${stat.bgClass} rounded-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <stat.icon className={`h-4 w-4 ${stat.iconClass}`} />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <motion.p
                      className="text-2xl font-bold"
                      key={stat.value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
  
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <TodoFilters
              filter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalCount={totalCount}
              completedCount={completedCount}
              pendingCount={pendingCount}
            />
          </CardHeader>
          <CardContent>
            <TodoList filter={filter} searchQuery={searchQuery} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
