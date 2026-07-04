import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const routeNames: Record<string, string> = {
  '/tech-stack': 'Tech Stack',
  '/architecture': 'Architecture',
  '/features': 'Features',
  '/code-organization': 'Code Organization',
  '/database': 'Database',
  '/api': 'API Design',
  '/testing': 'Testing',
  '/deployment': 'Deployment',
  '/security': 'Security',
  '/performance': 'Performance',
  '/workflows': 'Workflows'
}

export function Breadcrumbs() {
  const location = useLocation()
  
  if (location.pathname === '/') {
    return null
  }

  const routeName = routeNames[location.pathname] || 'Page'

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8 pt-2">
      <Link 
        to="/" 
        className="flex items-center hover:text-docs-text-strong transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      <ChevronRight className="w-4 h-4 text-slate-600" />
      <span className="text-slate-200 font-medium">{routeName}</span>
    </nav>
  )
}
