import Logo from 'svg/Logo'

export default function Loading() {
  return (
    <main className="h-screen w-screen bg-white">
      <div className="flex h-full w-full flex-col items-center justify-center p-8">
        <Logo
          aria-hidden="true"
          className="h-24 w-auto animate-bounce sm:h-28 lg:h-32"
        />
        <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          Loading...
        </h1>
      </div>
    </main>
  )
}
