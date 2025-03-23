import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './theme-toggle'

export function SocialLinks() {
  return (
    <nav className="flex items-center justify-center gap-4 text-sm mb-12">
      <Link
        to="/"
        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
      >
        0xdsqr
      </Link>
      <span className="text-muted-foreground">/</span>
      <Link
        to="/misc"
        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
      >
        misc
      </Link>
      <span className="text-muted-foreground">/</span>
      <Link
        to="/about"
        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
      >
        about
      </Link>
      <span className="text-muted-foreground">/</span>
      <ThemeToggle />
    </nav>
  )
}