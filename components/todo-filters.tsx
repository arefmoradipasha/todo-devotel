"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface TodoFiltersProps {
  filter: "all" | "completed" | "pending"
  onFilterChange: (filter: "all" | "completed" | "pending") => void
  searchQuery: string
  onSearchChange: (query: string) => void
  totalCount: number
  completedCount: number
  pendingCount: number
}

export function TodoFilters({
  filter,
  onFilterChange,searchQuery,onSearchChange,totalCount,completedCount,  pendingCount,
}: TodoFiltersProps) {


  const filters = [
    { key: "all" as const, label: "All", count: totalCount },
    { key: "pending" as const, label: "Pending", count: pendingCount },
    { key: "completed" as const, label: "Completed", count: completedCount },
  ]

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
        <Input
          placeholder="Search todos"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 " />
        <div className="flex gap-1">
          {filters.map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filterOption.key)}
              className={cn("text-xs", filter === filterOption.key && "shadow-sm")}
            >
              {filterOption.label}
              <span className="ml-1 px-1.5 py-0.5 rounded text-xs">{filterOption.count}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
