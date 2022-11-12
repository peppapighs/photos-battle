import Head from 'next/head'

import { useSession } from 'next-auth/react'

import AlbumGridList from 'components/album/AlbumGridList'
import Landing from 'components/Landing'
import PageLayout from 'components/layout/PageLayout'

export default function Home() {
  const { status } = useSession()

  return (
    <>
      <Head>
        <title>Home • photos-battle</title>
      </Head>
      <PageLayout>
        {status === 'unauthenticated' ? (
          <Landing />
        ) : (
          <div className="py-10">
            <header>
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100">
                  Albums
                </h1>
              </div>
            </header>
            <main>
              <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                <div className="px-4 py-8 sm:px-0">
                  <AlbumGridList />
                </div>
              </div>
            </main>
          </div>
        )}
      </PageLayout>
    </>
  )
}
