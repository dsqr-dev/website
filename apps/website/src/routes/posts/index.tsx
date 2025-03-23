import { useState, useEffect } from 'react'
import { getAllPosts } from '@/lib/content'
import { Breadcrumb } from '@/components/breadcrumb'
import { PostList } from '@/components/post-list'
import { SocialLinks } from '@/components/social-links'
import type { Post } from '@/lib/content'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        const allPosts = await getAllPosts()
        setPosts(allPosts)
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-4 pt-16 pb-8">
        {/* Top navigation */}
        <SocialLinks />
        
        {/* Breadcrumb - this is the correct pattern from the original app */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "0xdsqr", href: "/" },
              { label: "posts", href: "/posts" },
            ]}
          />
        </div>
        
        <div className="prose dark:prose-invert max-w-none mb-8">
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            A collection of articles, notes, and thoughts on software engineering, cloud infrastructure, and other topics.
          </p>
        </div>
        
        <div className="mt-8">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading posts...</div>
          ) : (
            <PostList posts={posts} />
          )}
        </div>
      </main>
    </div>
  )
}