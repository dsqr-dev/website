import { useState, useEffect } from 'react'
import { Newsletter } from '@/components/newsletter'
import { SocialLinks } from '@/components/social-links'
import { Link } from '@tanstack/react-router'
import { GithubIcon, ChevronRightIcon } from 'lucide-react'
import { PostList } from '@/components/post-list'
import { getAllPosts } from '@/lib/content'
import type { Post } from '@/lib/content'

export default function HomePage() {
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
        <SocialLinks />
        
        {/* Just showing the profile picture while hiding other Newsletter content */}
        <div className="flex flex-col items-center justify-center my-8">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted">
            <img
              src="/me.png"
              alt="0xdsqr"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="mt-8">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading posts...</div>
          ) : (
            <>
              <PostList posts={posts.slice(0, 5)} />
              <div className="flex justify-end mt-6">
                <Link
                  to="/posts"
                  className="text-sm text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
                >
                  View all posts
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
        <footer className="mt-8 py-6 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <div>Dave Dennis (@0xdsqr)</div>
          <a href="https://github.com/dsqr-dev" className="hover:text-primary transition-colors">
            <GithubIcon className="w-5 h-5" />
          </a>
        </footer>
      </main>
    </div>
  )
}