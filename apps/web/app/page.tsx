import { Newsletter } from "@/components/newsletter"
import { SocialLinks } from "@/components/social-links"
import Link from "next/link"
import { GithubIcon, ChevronRightIcon } from "lucide-react" 
import { PostList } from "@/components/post-list"
import { allPosts } from "contentlayer/generated"

export default function Home() {
  const posts = allPosts.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-4 pt-16 pb-8">
        <SocialLinks />
        <Newsletter />
        <div className="mt-16">
          <PostList posts={posts.slice(0, 5)} />
          <div className="flex justify-end mt-6">
            <Link 
              href="/posts" 
              className="text-sm text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
            >
              View all posts
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <footer className="mt-16 py-8 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <div>Dave Dennis (@0xdsqr)</div>
          <Link href="https://github.com/dsqr-dev" className="hover:text-primary transition-colors">
            <GithubIcon className="w-5 h-5" />
          </Link>
        </footer>
      </main>
    </div>
  )
}
