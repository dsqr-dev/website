"use client"

import { Button } from "@workspace/ui/components/button"
import { useState } from "react"

type Category = "All" | "TIL" | "Blog" | "Life"

interface PostFilterProps {
  onFilterChange: (category: Category) => void
}

export function PostFilter({ onFilterChange }: PostFilterProps) {
  const [activeFilter, setActiveFilter] = useState<Category>("All")

  const handleFilterClick = (category: Category) => {
    setActiveFilter(category)
    onFilterChange(category)
  }

  return (
    <div className="flex space-x-2 mb-4">
      {["All", "TIL", "Blog", "Life"].map((category) => (
        <Button
          key={category}
          variant={activeFilter === category ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterClick(category as Category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}

