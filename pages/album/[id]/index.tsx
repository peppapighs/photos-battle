import Head from 'next/head'
import { useRouter } from 'next/router'

import PageLayout from 'components/layout/PageLayout'

export default function AlbumPage() {
  const { id } = useRouter().query

  return (
    <>
      <Head>
        <title>Album • photos-battle</title>
      </Head>
      <PageLayout authRequired>
        <></>
      </PageLayout>
    </>
  )
}
