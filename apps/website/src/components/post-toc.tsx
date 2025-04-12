import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface TocItem {
  id: string
  text: string
  level: number
}

interface PostTocProps {
  activeSection: string
  items?: TocItem[] // Optional manual items
  selector?: string // Optional custom selector
}

export function PostToc({ activeSection, items, selector = 'article h2, article h3' }: PostTocProps) {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [tocItems, setTocItems] = useState<TocItem[]>(items || [])

  // Extract headings from the content if items were not provided
  useEffect(() => {
    if (items) {
      setTocItems(items)
      return
    }
    
    // First get all regular headings
    const headings = Array.from(document.querySelectorAll(selector))
      .map(heading => {
        const id = heading.id
        const text = heading.textContent || ''
        const level = heading.tagName === 'H2' ? 2 : heading.tagName === 'H3' ? 3 : 2
        return { id, text, level }
      })
      .filter(item => item.id && item.text)
    
    // Check if we have a "More Information" section and add it to the TOC
    // But only if it's not already in the headings list
    const moreInfoSection = document.getElementById('more-information')
    if (moreInfoSection && !headings.some(h => h.id === 'more-information')) {
      headings.push({
        id: 'more-information',
        text: 'More Information',
        level: 2
      })
    }

    setTocItems(headings)
  }, [items, selector])

  if (tocItems.length === 0) {
    return null
  }

  return (
    <>
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
            {tocItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-sm ${
                  activeSection === item.id 
                    ? "text-purple-600 dark:text-purple-400" 
                    : "text-muted-foreground"
                } ${item.level === 3 ? "ml-4" : ""}`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block w-full">
        <nav className="space-y-2">
          {tocItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-sm ${
                activeSection === item.id
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-muted-foreground hover:text-foreground"
              } ${item.level === 3 ? "ml-4" : ""}`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}