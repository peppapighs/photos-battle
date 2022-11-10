import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    error?: 'RefreshAccessTokenFailed' | 'RefreshTokenNotFound'
    user: {
      id: string
    } & DefaultSession['user']
  }
}
