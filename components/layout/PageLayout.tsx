import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { signIn, useSession } from 'next-auth/react'

import changeTheme from 'lib/changeTheme'

import Footer from './Footer'
import Loading from './Loading'
import Navbar from './Navbar'
interface Props {
  authRequired?: boolean
  children: React.ReactNode
}

export default function PageLayout({ authRequired, children }: Props) {
  const router = useRouter()
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

  useEffect(() => {
    if (authRequired && status === 'unauthenticated') {
      router.replace('/')
    }
  }, [status, authRequired, router])

  useEffect(() => changeTheme())

  if (status === 'loading') {
    return <Loading />
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <main className="flex min-h-screen flex-col">
        <Navbar />
        {children}
      </main>
      <Footer />
    </div>
  )
}
