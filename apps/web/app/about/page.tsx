import { SocialLinks } from "@/components/social-links"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-4 pt-16 pb-8">
        <SocialLinks />
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="text-2xl font-bold mb-6">About</h1>
          <p className="text-sm sm:text-base leading-relaxed">
            I&apos;m a software engineer focused on building cloud infrastructure and developer tools. Currently working on
            the cloud development team at{" "}
            <span className="text-[#0033A0] dark:text-[#00B4F4] font-medium italic border-b-2 border-dotted border-[#0033A0] dark:border-[#00B4F4]">
              Goldman Sachs
            </span>
            , where I help build and maintain our cloud platform.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-4">
            In my free time, I work on{" "}
            <a
              href="https://github.com/yourusername/dsqr"
              className="text-purple-600 dark:text-purple-400 border-b-2 border-dotted border-purple-600 dark:border-purple-400"
            >
              dsqr
            </a>
            , an open-source project that helps me manage my homelab and development workflow.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mt-4">I&apos;m particularly interested in:</p>
          <ul className="mt-2 space-y-2 text-sm sm:text-base">
            <li>Cloud infrastructure and platform engineering</li>
            <li>Developer tooling and automation</li>
            <li>System design and architecture</li>
            <li>Open source software</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

