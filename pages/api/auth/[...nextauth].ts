import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import prisma from 'lib/prismadb'

const GOOGLE_SCOPE =
  'openid email profile https://www.googleapis.com/auth/photoslibrary.readonly'

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: { scope: GOOGLE_SCOPE },
      },
    }),
    GoogleProvider({
      id: 'google-refresh-token',
      name: 'Google Refresh Token',
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: GOOGLE_SCOPE,
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (account) {
        if (account.provider === 'google-refresh-token') {
          account.provider = 'google'
        }

        const userAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        })

        if (userAccount && account.refresh_token) {
          await prisma.account.update({
            where: { id: userAccount.id },
            data: { refresh_token: account.refresh_token },
          })
        }
      }

      return true
    },
    async session({ session, user }) {
      const userAccount = await prisma.account.findFirst({
        where: { userId: user.id, provider: 'google' },
      })

      if (userAccount) {
        if (!userAccount.refresh_token) {
          return {
            ...session,
            error: 'RefreshTokenNotFound',
            user: {
              ...session.user,
              id: user.id,
            },
          }
        }

        if (
          !userAccount.access_token ||
          (userAccount.expires_at && userAccount.expires_at * 1000 < Date.now())
        ) {
          const url =
            'https://oauth2.googleapis.com/token?' +
            new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID || '',
              client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
              grant_type: 'refresh_token',
              refresh_token: userAccount.refresh_token,
            })

          const response = await fetch(url, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'POST',
          })

          if (!response.ok) {
            return {
              ...session,
              error: 'RefreshAccessTokenFailed',
              user: {
                ...session.user,
                id: user.id,
              },
            }
          }

          const data = await response.json()
          await prisma.account.update({
            where: { id: userAccount.id },
            data: {
              access_token: data.access_token,
              expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
            },
          })
        }
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      }
    },
  },
}

export default NextAuth(nextAuthOptions)
