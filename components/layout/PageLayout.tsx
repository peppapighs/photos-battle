import { useSession } from 'next-auth/react'

import Loading from './Loading'
import Navbar from './Navbar'
interface Props {
  children: React.ReactNode
}

export default function PageLayout({ children }: Props) {
  const { status } = useSession()

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
