import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { getPostBySlug } from '@/lib/content'
import { Breadcrumb } from '@/components/breadcrumb'
import { MdxContent } from '@/components/mdx-content'
import { SocialLinks } from '@/components/social-links'
import { CalendarIcon, EyeIcon, TagIcon } from 'lucide-react'
import type { Post } from '@/lib/content'

export default function PostPage() {
  // Get the slug from route params
  const { slug } = useParams({ from: '/posts/$slug' })
  
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      try {
        const foundPost = await getPostBySlug(slug)
        setPost(foundPost)
      } catch (error) {
        console.error(`Error loading post with slug ${slug}:`, error)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])
  
  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-16 pb-12 text-center">
        <SocialLinks />
        <div className="py-8 text-muted-foreground">Loading post...</div>
      </div>
    )
  }
  
  // If post not found
  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-16 pb-12 text-center">
        <SocialLinks />
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground">The post you're looking for doesn't exist or has been moved.</p>
      </div>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 pt-16 pb-12">
      {/* Top navigation */}
      <SocialLinks />
      
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: "0xdsqr", href: "/" },
            { label: "posts", href: "/posts" },
            { label: post.title, href: `/posts/${slug}` },
          ]}
        />
      </div>
      
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
              <EyeIcon className="w-4 h-4" />
              {post.views !== undefined ? post.views : '–'}
            </div>
            <div
              className={`flex items-center gap-2 ${
                post.category === "TIL"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : post.category === "Blog"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : post.category === "NixWithMe"
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-rose-600 dark:text-rose-400"
              }`}
            >
              <TagIcon className="w-4 h-4" />
              {post.category}
            </div>
          </div>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <MdxContent content={post.content} />
        </div>
      </article>
    </main>
  )
}