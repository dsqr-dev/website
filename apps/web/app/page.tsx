import { Newsletter } from "@/components/newsletter"
import { SocialLinks } from "@/components/social-links"
import Link from "next/link"
import { GithubIcon } from "lucide-react" 
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
      <main className="max-w-2xl mx-auto px-4 py-8">
        <SocialLinks />
        <Newsletter />
        <div className="mt-16">
        <PostList posts={posts} />
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
