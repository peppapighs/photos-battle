import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import prisma from 'lib/prismadb'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope:
            'openid email profile' +
            ' https://www.googleapis.com/auth/photoslibrary.readonly',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          id: user.id,
          ...session.user,
        },
      }
    },
  },
})
