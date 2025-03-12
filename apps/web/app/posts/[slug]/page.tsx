import { notFound } from "next/navigation"
import { allPosts } from "contentlayer/generated"

import { Breadcrumb } from "@/components/breadcrumb"
import { Mdx } from "@/components/mdx-components"
import { CalendarIcon, EyeIcon, TagIcon } from "lucide-react"

interface PostPageProps {
  params: {
    slug: string
  }
  searchParams: Record<string, string | string[]>
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  const slug = await params.slug
  const post = allPosts.find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "0xdsqr", href: "/" },
          { label: "posts", href: "/posts" },
          { label: slug, href: `/posts/${slug}` },
        ]}
      />
      <article className="mt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {post.date}
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
        <Mdx code={post.body.code} />
      </article>
    </main>
  )
}
