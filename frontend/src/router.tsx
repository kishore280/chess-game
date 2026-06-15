import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export interface RouterContext {
  user: { username: string; email: string } | null
}

async function getSession(): Promise<RouterContext['user']> {
  const res = await fetch('http://localhost:3001/me', { credentials: 'include' })
  return res.ok ? res.json() : null
}

export async function getRouter() {
  const user = await getSession()

  const router = createTanStackRouter({
    routeTree,
    context: { user },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: Awaited<ReturnType<typeof getRouter>>
  }
}
