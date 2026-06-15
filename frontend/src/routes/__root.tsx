import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

export interface AuthUser {
  userId: string
  username: string
  email: string
  token: string
}

const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const cookie = request.headers.get('cookie') ?? ''
  try {
    const res = await fetch('http://localhost:3001/me', { headers: { cookie } })
    return res.ok ? (res.json() as Promise<AuthUser>) : null
  } catch {
    return null
  }
})

export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await getSession()
    return { user }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Chess' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  )
}
