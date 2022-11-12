import { Fragment } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { signIn, signOut, useSession } from 'next-auth/react'

import classNames from 'lib/classNames'
import Logo from 'svg/Logo'

export default function Navbar() {
  const { asPath } = useRouter()
  const { status, data: session } = useSession()

  return (
    <Disclosure
      as="nav"
      className={classNames(
        'bg-white dark:bg-gray-800',
        status === 'unauthenticated' && asPath === '/' ? '' : 'shadow'
      )}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/" className="flex">
                  <span className="sr-only">photos-battle</span>
                  <Logo className="h-8 w-auto" alt="" />
                  <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                    photos-battle
                  </h1>
                </Link>
              </div>
              {status === 'authenticated' ? (
                <>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-900 dark:focus:ring-offset-gray-800">
                          <span className="sr-only">Open user menu</span>
                          <Image
                            className="h-8 w-8 rounded-full"
                            src={session.user?.image || '/assets/user.svg'}
                            width={32}
                            height={32}
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-20 mt-2 w-64 origin-top-right divide-y divide-gray-200 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-gray-600 dark:bg-gray-800 dark:ring-gray-600">
                          <div className="px-4 py-2">
                            <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                              {session.user?.name}
                            </p>
                            <p className="truncate text-xs font-normal text-gray-500 dark:text-gray-400">
                              {session.user?.email}
                            </p>
                          </div>
                          <div>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? 'bg-gray-100 dark:bg-gray-800'
                                      : '',
                                    'block px-4 py-2 text-sm text-gray-700 transition dark:text-gray-200'
                                  )}
                                  onClick={() => signOut()}
                                >
                                  Sign out
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    onClick={() => signIn('google')}
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </div>

          {status === 'authenticated' && (
            <Disclosure.Panel className="sm:hidden">
              <div className="pt-4 pb-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src={session.user?.image || '/assets/user.svg'}
                      width={40}
                      height={40}
                      alt=""
                    />
                  </div>
                  <div className="ml-3 truncate">
                    <div className="truncate text-base font-medium text-gray-800 dark:text-gray-100">
                      {session.user?.name}
                    </div>
                    <div className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      {session.user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as="a"
                    href="#"
                    className="block px-4 py-2 text-base font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  )
}
