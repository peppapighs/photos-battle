import prisma from 'lib/prismadb'

export default async function getGoogleAccessToken(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: 'google' },
  })
  return account?.access_token
}
