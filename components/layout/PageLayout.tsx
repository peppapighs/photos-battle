import { useEffect } from 'react'

import { signIn, useSession } from 'next-auth/react'

import Loading from './Loading'
import Navbar from './Navbar'
interface Props {
  children: React.ReactNode
}

export default function PageLayout({ children }: Props) {
  const { status, data: session } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session.error) {
      if (session.error === 'RefreshAccessTokenFailed') {
        signIn('google')
      } else if (session.error === 'RefreshTokenNotFound') {
        signIn('google-refresh-token')
      }
    }
  }, [status, session])

  if (status === 'loading') {
    return <Loading />
  }

  return (
    <div className="bg-gray-100">
      <main className="flex min-h-screen flex-col">
        <Navbar />
        {children}
      </main>
    </div>
  )
}
