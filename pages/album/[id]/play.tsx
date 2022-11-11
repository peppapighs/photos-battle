import Head from 'next/head'
import { useRouter } from 'next/router'

import Battle from 'components/album/Battle'
import PageLayout from 'components/layout/PageLayout'

export default function AlbumPage() {
  const { id: albumId } = useRouter().query

  return (
    <>
      <Head>
        <title>Play • photos-battle</title>
      </Head>
      <PageLayout authRequired>
        <div className="flex flex-1 flex-col justify-center py-10">
          <main>
            <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <Battle albumId={`${albumId}`} />
              </div>
            </div>
          </main>
        </div>
      </PageLayout>
    </>
  )
}
