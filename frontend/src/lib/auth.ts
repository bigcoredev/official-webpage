import { ACCESS_TOKEN_EXPIRE_TIME } from '@/lib/vars'
import {
  getServerSession,
  type NextAuthOptions,
  type Session,
  type User
} from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getSession } from 'next-auth/react'
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

const getAuthToken = (res: Response) => {
  const Authorization = res.headers.get('authorization') as string
  const parsedCookie = parseCookie(res.headers.get('set-cookie') || '')
  const refreshToken = parsedCookie.get('refresh_token') as string
  const refreshTokenExpires = parsedCookie.get('Expires') as string
  return {
    accessToken: Authorization,
    refreshToken,
    accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRE_TIME - 30 * 1000, // 29 minutes 30 seconds
    refreshTokenExpires: Date.parse(refreshTokenExpires) - 30 * 1000 // 23 hours 59 minutes 30 seconds
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials) {
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })

        if (res.ok) {
          const {
            accessToken,
            refreshToken,
            refreshTokenExpires,
            accessTokenExpires
          } = getAuthToken(res)

          const userRes = await fetch('user', {
            method: 'get',
            headers: {
              Authorization: accessToken
            }
          })

          if (userRes.ok) {
            const user: User = await userRes.json()
            return {
              username: user.username,
              role: user.role,
              accessToken,
              refreshToken,
              accessTokenExpires,
              refreshTokenExpires
            } as User
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (user) {
        token.username = user.username
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = user.accessTokenExpires
        token.refreshTokenExpires = user.refreshTokenExpires
      }
      return token
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      session.user = {
        username: token.username,
        role: token.role
      }
      session.token = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        accessTokenExpires: token.accessTokenExpires,
        refreshTokenExpires: token.refreshTokenExpires
      }
      return session
    }
  }
}

/**
 * Get session data.
 * @description If call this function in client, then call getSession, else call getServerSession.
 */
export const auth = async (): Promise<Session | null> =>
  typeof window !== 'undefined'
    ? await getSession()
    : await getServerSession(authOptions)
