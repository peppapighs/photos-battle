import { Fragment, useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

import PhotoGridList from 'components/album/PhotoGridList'
import PageLayout from 'components/layout/PageLayout'
import classNames from 'lib/classNames'
import { AlbumContents } from 'types/google'

const ALBUM_MENU = [
  { title: 'View All', current: true },
  { title: 'Leaderboard', current: false },
]

export default function AlbumPage() {
  const { id: albumId } = useRouter().query

  const [selected, setSelected] = useState(ALBUM_MENU[0])

  const fetchAllPhotos = async ({ pageParam = '' }) => {
    const res = await fetch(`/api/album/${albumId}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ pageToken: pageParam }),
    })
    return AlbumContents.parse(await res.json())
  }

  const fetchLeaderboard = async ({ pageParam = '' }) => {
    const res = await fetch(
      `/api/album/${albumId}?` + new URLSearchParams({ pageToken: pageParam })
    )
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
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                    Album
                  </h1>
                </div>
                <div className="flex items-center md:mt-0 md:ml-4">
                  <Listbox value={selected} onChange={setSelected}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="sr-only">
                          {' '}
                          Change view{' '}
                        </Listbox.Label>
                        <div className="relative">
                          <div className="inline-flex divide-x divide-blue-600 rounded-md shadow-sm">
                            <div className="inline-flex divide-x divide-blue-600 rounded-md shadow-sm">
                              <div className="inline-flex items-center rounded-l-md border border-transparent bg-blue-500 py-2 pl-3 pr-4 text-white shadow-sm">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                                <p className="ml-2.5 text-sm font-medium">
                                  {selected.title}
                                </p>
                              </div>
                              <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-blue-500 p-2 text-sm font-medium text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                                <span className="sr-only">Change view</span>
                                <ChevronDownIcon
                                  className="h-5 w-5 text-white"
                                  aria-hidden="true"
                                />
                              </Listbox.Button>
                            </div>
                          </div>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {ALBUM_MENU.map(option => (
                                <Listbox.Option
                                  key={option.title}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-900',
                                      'cursor-default select-none p-4 text-sm transition'
                                    )
                                  }
                                  value={option}
                                >
                                  {({ selected, active }) => (
                                    <div className="flex justify-between">
                                      <p
                                        className={
                                          selected
                                            ? 'font-semibold'
                                            : 'font-normal'
                                        }
                                      >
                                        {option.title}
                                      </p>
                                      {selected ? (
                                        <span
                                          className={
                                            active
                                              ? 'text-white'
                                              : 'text-blue-500'
                                          }
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </div>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
              </div>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <PhotoGridList
                  queryKey={[
                    'album',
                    `${albumId}`,
                    selected === ALBUM_MENU[0] ? 'all' : 'leaderboard',
                  ]}
                  queryFn={
                    selected === ALBUM_MENU[0]
                      ? fetchAllPhotos
                      : fetchLeaderboard
                  }
                />
              </div>
            </div>
          </main>
        </div>
      </PageLayout>
    </>
  )
}
