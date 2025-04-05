import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { getPostBySlug } from '@/lib/content'
import { MdxContent } from '@/components/mdx-content'
import { SocialLinks } from '@/components/social-links'
import { PostToc } from '@/components/post-toc'
import { FloatingTocButton } from '@/components/floating-toc-button'
import { TerminalPath } from '@/components/terminal-path'
import { CalendarIcon, EyeIcon, TagIcon } from 'lucide-react'
import type { Post } from '@/lib/content'

export default function PostPage() {
  // Get the slug from route params
  const { slug } = useParams({ from: '/posts/$slug' })
  
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("")
  
  // Setup intersection observer to track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    // Observe h2 and h3 headings in the article
    const sections = document.querySelectorAll("article h2, article h3")
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [post])

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
    <main className="max-w-4xl mx-auto px-4 pt-16 pb-12 flex-1">
      {/* Top navigation */}
      <SocialLinks />
      
      {/* Terminal-style path indicator with links */}
      <div className="max-w-2xl mx-auto mb-5 text-center">
        <TerminalPath 
          path={[
            { name: 'posts', href: '/posts', color: 'text-purple-500 dark:text-purple-400' },
            { 
              name: post.category.toLowerCase(), 
              ...(post.category === 'Blog' ? { href: '/posts?category=Blog', color: 'text-indigo-600 dark:text-indigo-400' } : 
                  post.category === 'TIL' ? { href: '/posts?category=TIL', color: 'text-emerald-600 dark:text-emerald-400' } : 
                  post.category === 'NixWithMe' ? { href: '/posts?category=NixWithMe', color: 'text-cyan-600 dark:text-cyan-400' } :
                  post.category === 'Life' ? { href: '/posts?category=Life', color: 'text-rose-600 dark:text-rose-400' } :
                  { href: `/posts?category=${post.category}` })
            }
          ]} 
          filename={slug} 
        />
      </div>
      
      <div className="relative">
        {/* Post title and metadata - centered */}
        <div className="max-w-2xl mx-auto mb-8">
          {/* Mobile Table of Contents (only visible on mobile) - now placed ABOVE content for better UX */}
          <div className="md:hidden mb-4">
            <PostToc activeSection={activeSection} />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
        
        {/* Main content - centered */}
        <div className="max-w-2xl mx-auto">
          <article className="prose dark:prose-invert max-w-none">
            <MdxContent content={post.content} />
          </article>
        </div>

        {/* Desktop Table of Contents - Right sidebar, fixed position */}
        <div className="hidden md:block absolute top-0 -right-64 w-56">
          <div className="sticky top-8">
            <h3 className="text-lg font-semibold mb-4">On this page</h3>
            <PostToc activeSection={activeSection} />
          </div>
        </div>
        
        {/* Floating TOC button that appears when scrolled past table of contents */}
        <FloatingTocButton activeSection={activeSection} />
      </div>
    </main>
  )
}