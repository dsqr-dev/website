import { notFound } from "next/navigation"
import { allPosts } from "contentlayer/generated"

import { Breadcrumb } from "@/components/breadcrumb"
import { Mdx } from "@/components/mdx-components"
import { CalendarIcon, EyeIcon, TagIcon } from "lucide-react"

// Set rendering mode
export const dynamic = 'auto'
export const dynamicParams = true

export async function generateStaticParams() {
  // Temporarily return no static paths to avoid build issues
  return []
}

export default async function Page({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params
  
  const post = allPosts.find((post) => post.slug === slug)
  
  if (!post) {
    notFound()
  }

  return (
    <main className="max-w-2xl mx-auto px-4 pt-16 pb-12">
      <Breadcrumb
        items={[
          { label: "0xdsqr", href: "/" },
          { label: "posts", href: "/posts" },
          { label: post.title, href: `/posts/${slug}` },
        ]}
      />
      <article className="mt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center gap-2">
              <EyeIcon className="w-4 h-4" />1
            </div>
            <div
              className={`flex items-center gap-2 ${
                post.category === "TIL"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : post.category === "Blog"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-rose-600 dark:text-rose-400"
              }`}
            >
              <TagIcon className="w-4 h-4" />
              {post.category}
            </div>
          </div>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          {/* Import and use the Mdx component to render MDX content */}
          <Mdx code={post.body.code} />
        </div>
      </article>
    </main>
  )
}
