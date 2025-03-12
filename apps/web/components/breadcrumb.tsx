import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

interface BreadcrumbProps {
  items: {
    label: string
    href: string
  }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <Link
            href={item.href}
            className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            {item.label}
          </Link>
          {index < items.length - 1 && <ChevronRightIcon className="w-4 h-4" />}
        </div>
      ))}
    </nav>
  )
}

