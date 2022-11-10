import Head from 'next/head'

import { useSession } from 'next-auth/react'

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
        {status === 'unauthenticated' ? <Landing /> : <></>}
      </PageLayout>
    </>
  )
}
