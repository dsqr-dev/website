import { allPosts } from "contentlayer/generated"
import { Breadcrumb } from "@/components/breadcrumb"
import { PostList } from "@/components/post-list"
import { SocialLinks } from "@/components/social-links"

export default function PostsPage() {
  const posts = allPosts.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-4 pt-16 pb-8">
        <SocialLinks />
        
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
          <PostList posts={posts} />
        </div>
      </main>
    </div>
  )
}