// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import getRoutes from 'src/navigation/routes'
import NotFound from 'src/pages/404'

const WindowWrapper = ({ children }) => {
  // ** State
  const [windowReadyFlag, setWindowReadyFlag] = useState(true)
  const auth = useAuth()
  const router = useRouter()

  const hasMatchingPath = (routes, path) => {
    if (path.includes(['/reset-password', '/welcome-page'])) {
      return true
    }
    for (const route of routes) {
      if (route.path === path) {
        return true
      }
      if (route.children && route.children.length > 0) {
        const childMatch = hasMatchingPath(route.children, path)
        if (childMatch) {
          return true
        }
      }
    }
    return false
  }

  useEffect(() => {
    if (auth.user && auth.user.role) {
      const routes = getRoutes(auth.user?.role)
      setWindowReadyFlag(hasMatchingPath(routes, router.route))
      // Redirect user to Home URL
      // router.replace(homeRoute)
    }
  }, [router.route])

  if (windowReadyFlag) {
    return <>{children}</>
  } else {
    return <NotFound />
  }
}

export default WindowWrapper
