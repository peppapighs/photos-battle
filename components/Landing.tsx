import { signIn } from 'next-auth/react'

export default function Landing() {
  return (
    <div className="relative flex-1 bg-white px-6 dark:bg-gray-800 lg:px-8">
      <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-center sm:text-6xl">
          Put your Google photos into battle
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-center">
          <span className="font-medium">photos-battle</span> is a web app that
          allows you to compare your Google photos and rate them against each
          other.
        </p>
        <div className="mt-8 flex sm:justify-center">
          <a
            href="#"
            className="inline-block rounded-lg bg-blue-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-blue-600 transition hover:bg-blue-700 hover:ring-blue-700"
            onClick={() => signIn('google')}
          >
            Get started
            <span className="text-blue-200" aria-hidden="true">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
