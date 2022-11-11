import { Fragment, useEffect } from 'react'

import { ExclamationCircleIcon, FolderIcon } from '@heroicons/react/24/outline'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import { AlbumList } from 'types/google'

import AlbumCard, { SkeletonAlbumCard } from './AlbumCard'

export default function AlbumGridList() {
  const { ref, inView } = useInView()

  const fetchAlbumList = async ({ pageParam = '' }) => {
    const res = await fetch('/api/album', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ pageToken: pageParam }),
    })
    return AlbumList.parse(await res.json())
  }

  const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(['albums'], fetchAlbumList, {
      getNextPageParam: lastPage => lastPage.nextPageToken,
    })

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage])

  if (status === 'loading') {
    return (
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {[...Array(8)].map((_, i) => (
          <li key={i}>
            <SkeletonAlbumCard />
          </li>
        ))}
      </ul>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-200">
        <ExclamationCircleIcon className="h-24 w-auto text-red-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          Error while loading albums.
        </h3>
        <p className="mt-1 text-base text-gray-600">
          Please refresh the page or try again later.
        </p>
      </div>
    )
  }

  if (data.pages[0].albums.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-200">
        <FolderIcon className="h-24 w-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No album found
        </h3>
        <p className="mt-1 text-base text-gray-600">
          Get started by creating a new album in Google Photos.
        </p>
      </div>
    )
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {data.pages.map((page, i) => (
        <Fragment key={i}>
          {page.albums.map(album => (
            <li key={album.id}>
              <AlbumCard album={album} />
            </li>
          ))}
        </Fragment>
      ))}
      {hasNextPage && (
        <button
          className={
            !hasNextPage || isFetchingNextPage ? 'cursor-not-allowed' : ''
          }
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          <span className="sr-only">Load more</span>
          <SkeletonAlbumCard />
        </button>
      )}
    </ul>
  )
}
