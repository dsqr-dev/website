"use client"

import { SocialLinks } from "@/components/social-links"
import { useState } from "react"
import { Check, Copy, ChevronDown } from "lucide-react"
import { useEffect } from "react"
import { Button } from "@workspace/ui/components/button"

export default function MiscPage() {
  const [copied, setCopied] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("gpg-key")

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
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-4xl mx-auto px-4 pt-16 pb-8">
        <SocialLinks />

        {/* Mobile Navigation */}
        <div className="md:hidden mb-8">
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg border text-sm"
          >
            <span className="text-muted-foreground">On this page</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isNavOpen ? "rotate-180" : ""}`} />
          </button>
          {isNavOpen && (
            <nav className="mt-2 p-2 border rounded-lg space-y-2 bg-background">
              <a
                href="#gpg-key"
                className={`block text-sm ${
                  activeSection === "gpg-key" ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground"
                }`}
              >
                GPG Key
              </a>
            </nav>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-3/4 space-y-12">
            <section id="gpg-key">
              <h2 className="text-2xl font-semibold mb-4">GPG Key</h2>
              <div className="relative">
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono">{gpgKey}</pre>
                <Button variant="outline" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </section>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block md:w-1/4">
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold mb-4">On this page</h3>
              <nav className="space-y-2">
                <a
                  href="#gpg-key"
                  className={`block text-sm ${
                    activeSection === "gpg-key"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  GPG Key
                </a>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

