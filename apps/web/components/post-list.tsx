"use client"

import { useState } from "react"
import Link from "next/link"
import { EyeIcon, TagIcon, ChevronUpIcon, ChevronDownIcon, CalendarIcon, FilterIcon } from "lucide-react"
import type { Post } from "contentlayer/generated"

interface PostListProps {
  posts: Post[]
}

type CategoryFilter = "All" | "TIL" | "Blog" | "Life" | "NixWithMe"

export function PostList({ posts }: PostListProps) {
  const [sortAscending, setSortAscending] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "views">("date")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All")

  const filteredAndSortedPosts = [...posts]
    .filter((post) => categoryFilter === "All" || post.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return sortAscending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
      } else {
        // For views, we're using a mock number 1 for all posts now
        return sortAscending ? 1 - 1 : 1 - 1
      }
    })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setSortBy("date")
              setSortAscending(sortBy === "date" ? !sortAscending : false)
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Date</span>
            {sortBy === "date" &&
              (sortAscending ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
          </button>
          <button
            onClick={() => {
              setSortBy("views")
              setSortAscending(sortBy === "views" ? !sortAscending : false)
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
            <span>Views</span>
            {sortBy === "views" &&
              (sortAscending ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <FilterIcon className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1">
            {(["All", "Blog", "TIL", "Life"] as const).map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  categoryFilter === category
                    ? category === "All"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      : category === "Blog"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                        : category === "TIL"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSortedPosts.length > 0 ? (
          filteredAndSortedPosts.map((post) => (
            <Link key={post._id} href={post.url} className="block group">
              <article className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <h2 className="text-base sm:text-lg font-medium mb-2 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4 flex-shrink-0" />
                    <span>1</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      post.category === "TIL"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : post.category === "Blog"
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    <TagIcon className="w-3 h-3 flex-shrink-0" />
                    <span>{post.category}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No posts found matching your filter.</div>
        )}
      </div>
    </div>
  )
}

