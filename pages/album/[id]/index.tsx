import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import PhotoGridList from 'components/album/PhotoGridList'
import PageLayout from 'components/layout/PageLayout'
import classNames from 'lib/classNames'
import { AlbumContents } from 'types/google'

export default function AlbumPage() {
  const { id: albumId } = useRouter().query

  const tabs = [
    { name: 'View All', href: '#', current: true },
    {
      name: 'Leaderboard',
      href: `/album/${albumId}/leaderboard`,
      current: false,
    },
  ]

  const fetchAllPhotos = async ({ pageParam = '' }) => {
    const res = await fetch(`/api/album/${albumId}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ pageToken: pageParam }),
    })
    return AlbumContents.parse(await res.json())
  }

  return (
    <>
      <Head>
        <title>Album • photos-battle</title>
      </Head>
      <PageLayout authRequired>
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <nav
                className="isolate flex divide-x divide-gray-200 rounded-lg shadow dark:divide-gray-600"
                aria-label="Tabs"
              >
                {tabs.map((tab, tabIdx) => (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      tab.current
                        ? 'text-gray-900 dark:text-gray-100'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                      tabIdx === 0 ? 'rounded-l-lg' : '',
                      tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                      'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium transition hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:hover:bg-gray-700'
                    )}
                    aria-current={tab.current ? 'page' : undefined}
                  >
                    <span>{tab.name}</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        tab.current ? 'bg-blue-500' : 'bg-transparent',
                        'absolute inset-x-0 bottom-0 h-0.5'
                      )}
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <PhotoGridList
                  queryKey={['album', `${albumId}`, 'all']}
                  queryFn={fetchAllPhotos}
                />
              </div>
            </div>
          </main>
        </div>
      </PageLayout>
    </>
  )
}
