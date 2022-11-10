import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    error?: 'RefreshAccessTokenFailed' | 'RefreshTokenNotFound'
  }
}
