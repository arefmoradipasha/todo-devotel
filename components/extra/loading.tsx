import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { motion } from 'framer-motion'
import { Skeleton } from '../ui/skeleton'

const LoadingMain = () => {
  return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Todo App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-8 w-16" />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
  )
}

export default LoadingMain
