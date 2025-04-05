import { useState, useEffect } from 'react'
import { SocialLinks } from '@/components/social-links'
import { PostToc, TocItem } from '@/components/post-toc'
import { TerminalPath } from '@/components/terminal-path'
import { FloatingTocButton } from '@/components/floating-toc-button'
import { Check, Copy } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

export default function MiscPage() {
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState("gpg-key")
  
  // Define manual TOC items for misc page
  const tocItems: TocItem[] = [
    { id: "gpg-key", text: "GPG Key", level: 2 }
  ]

  const gpgKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
bingbong
-----END PGP PUBLIC KEY BLOCK-----`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(gpgKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

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

    const sections = document.querySelectorAll("section")
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  return (
    <main className="max-w-5xl mx-auto px-4 pt-16 pb-12">
      {/* Top navigation */}
      <SocialLinks />
      
      {/* Terminal-style path indicator with links */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <TerminalPath 
          path={[
            { 
              name: 'misc', 
              href: '/misc', 
              color: 'text-purple-500 dark:text-purple-400' 
            }
          ]} 
          filename="" 
        />
        
        {/* Mobile Table of Contents (only visible on mobile) */}
        <div className="md:hidden mt-4">
          <PostToc activeSection={activeSection} items={tocItems} />
        </div>
      </div>
      
      <div className="relative w-full">
        {/* Main content - expanded to use more space */}
        <div className="w-full pr-0 md:pr-64">
          {/* Main content */}
          <div className="space-y-8 w-full">
            <section id="gpg-key" className="w-full">
              <h2 className="text-2xl font-semibold mb-4">GPG Key</h2>
              <div className="relative w-full block">
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono w-full block">{gpgKey}</pre>
                <Button variant="outline" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </section>
          </div>
        </div>

        {/* Desktop Table of Contents - Right sidebar, fixed position */}
        <div className="hidden md:block absolute top-0 -right-64 w-56">
          <div className="sticky top-8">
            <h3 className="text-lg font-semibold mb-4">On this page</h3>
            <PostToc activeSection={activeSection} items={tocItems} />
          </div>
        </div>
        
        {/* Floating TOC button that appears when scrolled past table of contents */}
        <FloatingTocButton activeSection={activeSection} items={tocItems} />
      </div>
    </main>
  )
}